/**
 * 
 * @param {string} endpoint 디스코드 API 엔드포인트
 * @param {object} data JSON.stringify 할 수 있는 object
 * @param {string} method POST(Default) | GET | PATCH | DELETE
 * @returns 
 */
module.exports = async function request(endpoint, data, method) {
  const url = 'https://discord.com/api/v8/' + endpoint;
  const init = {
    body: JSON.stringify(data),
    method: method | "POST",
    headers: {
      "authorization": "Bearer " + DISCORD_CLIENT_CREDENTIAL,
      // Or you can use your bot token instead.
      // "authorization": "Bot " + DISCORD_BOT_TOKEN
      "content-type": "application/json;charset=UTF-8",
    },
  };
  
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(response.status + ' : ' + response.statusText);

  return response;
}