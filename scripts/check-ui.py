from playwright.sync_api import sync_playwright, expect
with sync_playwright() as p:
 b=p.chromium.launch(); page=b.new_page(viewport={'width':1280,'height':800});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:3018/',wait_until='networkidle')
 expect(page.get_by_role('heading',name='What shall we do today?')).to_be_visible()
 for name in ['Shopping','Travel','Events','Maps','Payments & receipts','Email','Calendar','Notion','Profile & memory','Documents','Design & creations','Reminders & delivery','GitHub']:
  page.get_by_role('button',name=name,exact=True).click();expect(page.get_by_role('heading',name=name,exact=True)).to_be_visible();expect(page.get_by_role('heading',name='Connection required')).to_be_visible()
 page.get_by_role('button',name='Lists',exact=True).click();page.get_by_role('textbox',name='New list item').fill('<script>alert(1)</script>');page.get_by_role('button',name='Add item').click();expect(page.get_by_text('<script>alert(1)</script>',exact=True)).to_be_visible();page.get_by_role('checkbox').check();page.reload();expect(page.get_by_role('heading',name='What shall we do today?')).to_be_visible();page.get_by_role('button',name='Lists',exact=True).click();expect(page.get_by_role('checkbox')).to_be_checked();page.get_by_role('button',name='Remove <script>alert(1)</script>').click();expect(page.get_by_role('checkbox')).to_have_count(0)
 page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth <= innerWidth');page.get_by_role('button',name='GitHub',exact=True).click();expect(page.get_by_role('heading',name='GitHub',exact=True)).to_be_visible();assert not errors,errors
 page.screenshot(path='/tmp/olli-fresh-mobile.png',full_page=True);page.set_viewport_size({'width':1280,'height':800});page.get_by_role('button',name='Chat',exact=True).click();page.screenshot(path='/tmp/olli-fresh-desktop.png',full_page=True);b.close()
 print('Passed: navigation, unavailable states, list add/check/reload/remove, text injection safety and mobile overflow.')
