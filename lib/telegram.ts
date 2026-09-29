export async function sendTelegramNotification(message: string) {
  const envObj = process["env"];
  const botToken = envObj.TELEGRAM_BOT_TOKEN;
  const chatId = envObj.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram bot token atau chat ID tidak dikonfigurasi.");
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      console.error("Gagal mengirim pesan Telegram:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error mengirim notifikasi Telegram:", error);
    return false;
  }
}
