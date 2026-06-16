import sys
import subprocess

# Get original index.html from git to extract vt-sec
try:
    index_html = subprocess.check_output(['git', 'show', 'HEAD:index.html']).decode('utf-8')
except Exception as e:
    print('git show failed:', e)
    sys.exit(1)

vt_sec_start = index_html.find('<!-- ═══════════════════════════════════════════════════════════\n     BUSINESS VERTICALS')
vt_sec_end = index_html.find('</section>', vt_sec_start) + 10
vt_sec = index_html[vt_sec_start:vt_sec_end]

v1_start = vt_sec.find('<!-- V1: Spare Parts -->')
v2_start = vt_sec.find('<!-- V2: Workshop (reversed) -->')
v3_start = vt_sec.find('<!-- V3: Trading -->')
v4_start = vt_sec.find('<!-- V4: Import/Export (reversed) -->')
v_end = vt_sec.find('</section>')

v1 = vt_sec[v1_start:v2_start]
v2 = vt_sec[v2_start:v3_start]
v3 = vt_sec[v3_start:v4_start]
v4 = vt_sec[v4_start:v_end]

# Modify v1 to use the new image
v1 = v1.replace('spare-parts-2.png', 'NOOR AL AMAL copy-04.jpg')
v1 = v1.replace('<div class="vt-row">', '<div class="vt-row" style="border-top:none; min-height: calc(100vh - 100px); padding-top: 80px;">')
v2 = v2.replace('<div class="vt-row vt-row-rev">', '<div class="vt-row vt-row-rev" style="border-top:none; min-height: calc(100vh - 100px); padding-top: 80px;">')
v3 = v3.replace('<div class="vt-row">', '<div class="vt-row" style="border-top:none; min-height: calc(100vh - 100px); padding-top: 80px;">')
v4 = v4.replace('<div class="vt-row vt-row-rev">', '<div class="vt-row vt-row-rev" style="border-top:none; min-height: calc(100vh - 100px); padding-top: 80px;">')

# Get current index.html layout to build the pages
with open('index.html', 'r', encoding='utf-8') as f:
    current_index = f.read()

# Replace <html lang="en"> with <html lang="en" data-theme="dark">
current_index = current_index.replace('<html lang="en">', '<html lang="en" data-theme="dark">')

nav_end = current_index.find('</header>') + 9
foot_start = current_index.find('<footer class="footer">')

head_and_nav = current_index[:nav_end]
foot_and_scripts = current_index[foot_start:]

def build_page(v_content, title):
    content = head_and_nav + '\n<main class="page-content" style="background: var(--bg2);">\n<section class="section vt-sec" style="padding:0;">\n<div class="container" style="display:none;"></div>\n' + v_content + '</section>\n</main>\n' + foot_and_scripts
    # Fix the title
    content = content.replace('<title>Noor Al Amal</title>', f'<title>Noor Al Amal - {title}</title>')
    return content

with open('spare-parts.html', 'w', encoding='utf-8') as f: f.write(build_page(v1, 'Spare Parts'))
with open('workshop.html', 'w', encoding='utf-8') as f: f.write(build_page(v2, 'Workshop'))
with open('trading.html', 'w', encoding='utf-8') as f: f.write(build_page(v3, 'Trading'))
with open('logistics.html', 'w', encoding='utf-8') as f: f.write(build_page(v4, 'Logistics'))

print('Generated pages successfully!')
