export const features = [
  ['chat','Chat','message-square','Talk with Olli and review its work.'],
  ['shopping','Shopping','shopping-bag','Compare products and track prices.'],
  ['travel','Travel','plane','Explore flights, hotels and travel options.'],
  ['events','Events','calendar-days','Discover events and activities.'],
  ['maps','Maps','map','Find places, directions and transport.'],
  ['payments','Payments & receipts','credit-card','Hosted payment links and receipt tracking. Never enter card details here.'],
  ['email','Email','mail','Personal mail and an agent inbox.'],
  ['calendar','Calendar','calendar','Calendar events and ICS exports.'],
  ['notion','Notion','notebook','Read and organize connected pages.'],
  ['lists','Lists','list-checks','Keep named lists in this browser.'],
  ['memory','Profile & memory','smile','Personal profile, memory and stickers.'],
  ['documents','Documents','file-text','Create documents and spreadsheets.'],
  ['design','Design & creations','palette','Images, design assets and generated creations.'],
  ['reminders','Reminders & delivery','bell','Personal reminders and non-Slack messaging.'],
  ['github','GitHub','git-branch','Repositories, issues, pull requests and checks.'],
].map(([id,name,icon,description])=>({id,name,icon,description}));
export function executionStatus() {
  return { enabled:false, reason:'No verified free execution provider is connected. No commands will run on the web host.' };
}
export function parseLists(raw) {
  try { const value=JSON.parse(raw); return Array.isArray(value) ? value.filter(x=>x && typeof x.text==='string' && typeof x.done==='boolean').slice(0,500).map(x=>({text:x.text.slice(0,500),done:x.done})) : []; } catch { return []; }
}
