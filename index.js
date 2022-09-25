function generateToken(tokenServerUrl, userID, roomID, userName) {
  return fetch(
    `${tokenServerUrl}/access_token?userID=${userID}&userName=${userName}&roomID=${roomID}&expired_ts=7200`,
    {
      method: "GET",
    }
  ).then((res) => res.json());
}

function randomId(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

function getUrlParams(url) {
  let url_temp = url.split("?")[1];
  let searchParams = new URLSearchParams(url_temp);

  let object = Object.fromEntries(searchParams.entries());
  return object;
}

// Call the following method to generate a Token.
async function init() {
  const roomId = getUrlParams(window.location.href)["roomId"] || randomId(5);
  const role = getUrlParams(window.location.href)["role"] || "HOST";

  generateToken(
    "https://test-live-streaming-app-1.herokuapp.com",
    randomId(5),
    roomId,
    randomId()
  ).then((token) => {
    console.log(token);
    const TOKEN = token.token;
    const zp = ZegoUIKitPrebuilt.create(TOKEN);
    // Here's the code for a host to join a room:
    zp.joinRoom({
      container: document.querySelector("#root"),
      showNonVideoUser: false,
    });

    // Here's the code for a viewer to join a room:
    zp.joinRoom({
      container: document.querySelector("#root"),
      preJoinViewConfig: {
        invitationLink:
          window.location.origin + window.location.pathname + "?roomId=" + roomId + "&role=VIEWER", // invite link, if empty, it will not be displayed, default empty
      },
      showNonVideoUser: false,
      turnOnMicrophoneWhenJoining: role === "HOST",
      turnOnCameraWhenJoining: role === "HOST",
      showMyCameraToggleButton: role === "HOST",
      showMyMicrophoneToggleButton: role === "HOST",
      showAudioVideoSettingsButton: role === "HOST",
    });
  });
}

init();
