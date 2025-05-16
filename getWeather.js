/**
 * 福岡県福岡市博多区の天気と気温を取得する関数
 * @param {string} apiKey - OpenWeatherMap APIキー
 * @returns {Promise<Object>} 天気情報を含むオブジェクト
 */
async function getFukuokaHakataWeather(apiKey) {
  try {
    // 福岡県福岡市博多区の緯度と経度
    const latitude = 33.5903;
    const longitude = 130.4209;

    // OpenWeatherMap APIのURL
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ja&appid=${apiKey}`;

    // APIリクエストを送信
    const response = await fetch(url);

    // レスポンスが正常でない場合はエラーをスロー
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // JSONデータを取得
    const data = await response.json();

    // 必要な情報を抽出
    const weatherInfo = {
      location: '福岡県福岡市博多区',
      weather: data.weather[0].description,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      timestamp: new Date(data.dt * 1000).toLocaleString('ja-JP')
    };

    return weatherInfo;
  } catch (error) {
    console.error('天気情報の取得中にエラーが発生しました:', error);
    throw error;
  }
}

// 使用例
// 注意: 実際に使用する場合は、有効なAPIキーを指定する必要があります
// APIキーはOpenWeatherMapのウェブサイトで取得できます: https://openweathermap.org/api
async function showWeather() {
  try {
    const apiKey = 'あなたのAPIキーをここに入力';
    const weatherData = await getFukuokaHakataWeather(apiKey);

    console.log('=== 福岡市博多区の天気情報 ===');
    console.log(`場所: ${weatherData.location}`);
    console.log(`天気: ${weatherData.weather}`);
    console.log(`気温: ${weatherData.temperature}℃`);
    console.log(`体感温度: ${weatherData.feelsLike}℃`);
    console.log(`湿度: ${weatherData.humidity}%`);
    console.log(`風速: ${weatherData.windSpeed}m/s`);
    console.log(`取得時刻: ${weatherData.timestamp}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// 実行
// showWeather();
