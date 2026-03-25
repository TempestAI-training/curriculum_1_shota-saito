import os
import psycopg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# 💡 ここが最大の修正ポイント！ ["*"] を設定して、Vercelからの通信を無条件で通す「無敵モード」にしました
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AzureOpenAI(
    api_key=os.environ.get("AZURE_OPENAI_API_KEY"),
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT")
)

DB_URL = os.environ.get("DATABASE_URL")
# 過去何件のメッセージをAIに思い出させるか（コスト削減のため制限します）
CHAT_HISTORY_LIMIT = 6 

# 【追加】アプリ起動時に、データを保存する「表（テーブル）」を自動作成する
@app.on_event("startup")
def startup_event():
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id SERIAL PRIMARY KEY,
                    conversation_id VARCHAR(255) NOT NULL,
                    role VARCHAR(50) NOT NULL,
                    content TEXT NOT NULL,
                    model VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        conn.commit()

class ChatRequest(BaseModel):
    message: str
    # 誰の会話履歴かを見分けるためのID（今回はシンプルに固定文字を使います）
    conversation_id: str = "default_session"

# 【追加】過去の会話履歴をフロントエンドに返すためのAPI
@app.get("/chat/{conversation_id}")
def get_history(conversation_id: str):
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT role, content FROM messages
                WHERE conversation_id = %s
                ORDER BY created_at ASC
            """, (conversation_id,))
            rows = cur.fetchall()
            return {"messages": [{"role": row[0], "content": row[1]} for row in rows]}

@app.post("/chat")
def chat(request: ChatRequest):
    try:
        model_name = os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME")
        
        # 1. ユーザーのメッセージをDBに保存
        with psycopg.connect(DB_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO messages (conversation_id, role, content, model)
                    VALUES (%s, %s, %s, %s)
                """, (request.conversation_id, "user", request.message, model_name))
            conn.commit()

        # 2. 過去の履歴をDBから取得（直近の数件だけ）
        with psycopg.connect(DB_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT role, content FROM messages
                    WHERE conversation_id = %s
                    ORDER BY created_at DESC
                    LIMIT %s
                """, (request.conversation_id, CHAT_HISTORY_LIMIT))
                rows = cur.fetchall()
                # 新しい順で取れてしまうので、古い順（時系列）に並べ直す
                history = [{"role": row[0], "content": row[1]} for row in reversed(rows)]

        # 3. AIに送るメッセージの組み立て（設定 ＋ 過去の履歴）
        messages = [{"role": "system", "content": "あなたは日本の内閣総理大臣である高市早苗です。ユーザーからの質問に対して、高市早苗の視点や政策に基づいて、丁寧で親しみやすい口調で答えてください。"}]
        messages.extend(history) 

        # 4. AIにリクエスト送信
        response = client.chat.completions.create(
            model=model_name,
            messages=messages
        )
        ai_message = response.choices[0].message.content

        # 5. AIの返答もDBに保存
        with psycopg.connect(DB_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO messages (conversation_id, role, content, model)
                    VALUES (%s, %s, %s, %s)
                """, (request.conversation_id, "assistant", ai_message, model_name))
            conn.commit()

        return {"reply": ai_message}

    except Exception as e:
        return {"error": str(e)}