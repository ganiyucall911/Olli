"""Requires local Playwright and `npm run dev` on port 3018."""
from playwright.sync_api import sync_playwright, expect
with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page(viewport={"width":1280,"height":800})
    page.goto('http://127.0.0.1:3018/',wait_until='networkidle')
    logo=page.get_by_role('img',name='Olli',exact=True)
    expect(logo).to_be_visible()
    assert logo.evaluate('(i)=>i.complete && i.naturalWidth>0')
    chat=page.get_by_role('navigation',name='Dock',exact=True).get_by_role('button',name='Chat',exact=True)
    chat.hover();page.wait_for_timeout(250)
    assert chat.evaluate('(e)=>getComputedStyle(e).transform')!='none'
    chat.focus();assert chat.evaluate('(e)=>getComputedStyle(e).outlineStyle')=='solid'
    page.screenshot(path='/tmp/olli-polished-desktop.png',full_page=True)
    page.emulate_media(reduced_motion='reduce');chat.hover();page.wait_for_timeout(100)
    assert chat.evaluate('(e)=>getComputedStyle(e).transform')=='none'
    assert chat.evaluate('(e)=>getComputedStyle(e).transitionDuration')=='0s'
    disabled=page.get_by_role('button',name='Not connected',exact=True)
    assert disabled.is_disabled()
    page.set_viewport_size({'width':390,'height':844})
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    expect(logo).to_be_visible()
    page.screenshot(path='/tmp/olli-polished-mobile.png',full_page=True)
    page.set_viewport_size({'width':1100,'height':700})
    page.set_content('''<html><body style="margin:0;background:#111;color:#eee;font-family:system-ui;padding:64px"><p style="letter-spacing:4px;color:#aaa;font-size:12px">OLLI / IDENTITY 01</p><img src="http://127.0.0.1:3018/src/assets/brand/olli-logo.svg" alt="Olli identity" style="width:368px;margin:55px 0"><div style="display:flex;align-items:center;gap:75px;border-top:1px solid #333;padding-top:38px"><img src="http://127.0.0.1:3018/src/assets/brand/olli-mark.svg" width="96"><img src="http://127.0.0.1:3018/src/assets/brand/olli-mark-mono.svg" width="64"><img src="http://127.0.0.1:3018/src/assets/brand/favicon.svg" width="40"><span style="font-size:12px;color:#aaa">NESTED MONOGRAM<br><br>Original vector mark · Custom outlined wordmark<br>Silver / charcoal / signal blue</span></div></body></html>''')
    page.wait_for_function('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
    page.screenshot(path='/tmp/olli-identity-board.png')
    browser.close()
    print('Logo loading, hover elevation, keyboard focus, reduced motion, disabled controls and mobile overflow passed.')
