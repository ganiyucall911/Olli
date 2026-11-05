export const features = [
  ['chat','Chat','✦','Talk with Olli and review its work.'],
  ['shopping','Shopping','◇','Compare products and track prices.'],
  ['travel','Travel','↗','Explore flights, hotels and travel options.'],
  ['events','Events','☆','Discover events and activities.'],
  ['maps','Maps','⌖','Find places, directions and transport.'],
  ['payments','Payments & receipts','▤','Hosted payment links and receipt tracking. Never enter card details here.'],
  ['email','Email','✉','Personal mail and an agent inbox.'],
  ['calendar','Calendar','▦','Calendar events and ICS exports.'],
  ['notion','Notion','N','Read and organize connected pages.'],
  ['lists','Lists','✓','Keep named lists in this browser.'],
  ['memory','Profile & memory','◎','Personal profile, memory and stickers.'],
  ['documents','Documents','▥','Create documents and spreadsheets.'],
  ['design','Design & creations','◈','Images, design assets and generated creations.'],
  ['reminders','Reminders & delivery','◷','Personal reminders and non-Slack messaging.'],
  ['github','GitHub','⑂','Repositories, issues, pull requests and checks.'],
].map(([id,name,icon,description])=>({id,name,icon,description}));
export function executionStatus() {
  return { enabled:false, reason:'No verified free execution provider is connected. No commands will run on the web host.' };
}
export function parseLists(raw) {
  try { const value=JSON.parse(raw); return Array.isArray(value) ? value.filter(x=>x && typeof x.text==='string' && typeof x.done==='boolean').slice(0,500).map(x=>({text:x.text.slice(0,500),done:x.done})) : []; } catch { return []; }
}
