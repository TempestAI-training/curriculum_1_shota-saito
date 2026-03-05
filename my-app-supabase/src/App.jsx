// src/App.jsx

import { useState } from 'react'
import './App.css'
import { supabase } from './supabaseClient' // さっき作った設定を読み込む

function App() {
  const [score, setScore] = useState(0) // Aのスコア

  // 1. 投票機能 (データを送信)
  const handleVote = async (choice) => {
    try {
      // votesテーブルに { item: 'A' } などを追加
      const { error } = await supabase
        .from('votes')
        .insert([{ item: choice }])

      if (error) {
        console.error('エラー:', error)
      } else {
        alert(`${choice} に投票しました！`)
      }
    } catch (err) {
      console.error('予期せぬエラー:', err)
    }
  }

  // 2. 集計機能 (データを取得して計算)
  const handleCalculate = async () => {
    try {
      // votesテーブルから全データを取得
      const { data, error } = await supabase
        .from('votes')
        .select('*')

      if (error) {
        console.error('取得エラー:', error)
        return
      }

      // 'A' の数を数える (filterで抽出してlengthで数える)
      const aVotes = data.filter((v) => v.item === 'A')
      
      // スコア計算 (例: 1票2点)
      setScore(aVotes.length * 2)

      console.log('取得した全データ:', data)
      
    } catch (err) {
      console.error('予期せぬエラー:', err)
    }
  }

  return (
    <div className="App">
      <h1>投票システム(Supabase連携)</h1>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => handleVote('A')}>
          Aに投票 (2点)
        </button>
        <button onClick={() => handleVote('B')} style={{ marginLeft: '10px' }}>
          Bに投票 (0点)
        </button>
      </div>

      <div style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <button onClick={handleCalculate}>
          Aのスコアを計算する
        </button>
        <h2>Aの現在のスコア: {score} 点</h2>
      </div>
    </div>
  )
}

export default App