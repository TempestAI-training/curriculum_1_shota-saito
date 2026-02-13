// 1. APIのURL（東京の天気予報を取得する魔法の呪文）
const API = "https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo&forecast_days=1";

// 2. データを取得する関数 (非同期なので async をつける)
const getWeatherData = async () => {
  try {
    // fetchでAPIにアクセスし、結果が返ってくるまで待つ (await)
    const response = await fetch(API);
    // 返ってきたデータをJSON形式（プログラムで扱える形）に変換して待つ
    const data = await response.json();
    return data;
  } catch (error) {
    // 通信エラーなどが起きたらコンソールに表示
    console.error("エラーが発生しました:", error);
  }
};

// 3. 画面に表示する関数
const displayWeather = async () => {
  // データを取ってくる
  const data = await getWeatherData();
  
  // データが正しく取れたか確認（コンソールを見てみよう）
  console.log(data);

  if (data) {
    // 必要なデータを取り出す
    // data.daily.time[0] -> 日付
    // data.daily.temperature_2m_min[0] -> 最低気温
    // data.daily.temperature_2m_max[0] -> 最高気温
    const date = data.daily.time[0];
    const minTemp = data.daily.temperature_2m_min[0];
    const maxTemp = data.daily.temperature_2m_max[0];

    // HTMLの要素を取得して、中身を書き換える
    document.getElementById("title").textContent = `${date} の東京の気温`;
    document.getElementById("min_temp").textContent = `最低気温: ${minTemp} 度`;
    document.getElementById("max_temp").textContent = `最高気温: ${maxTemp} 度`;
  }
};

// 4. 実行！
displayWeather();