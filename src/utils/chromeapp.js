// Robotkodarn's Chrome App ID
const CHROME_EXTENSION_ID = process.env.CHROME_EXTENSION_ID

export const connectPort = () => chrome.runtime.connect(CHROME_EXTENSION_ID)