============================================================
  ANGELINA — DANCE PERFORMANCE WEBSITE
  A simple guide for editing & publishing your site
============================================================

You don't need to be technical to run this site. It is just a folder
of files. This guide walks you through everything, step by step.

TIP: Before you change anything, make a COPY of this whole folder and
keep it somewhere safe as a backup.


------------------------------------------------------------
  WHAT'S IN THIS FOLDER
------------------------------------------------------------
  index.html .............. the website itself (all the words live here)
  css/ .................... how the site looks (colours, fonts)
  js/ ..................... small bit of code that makes things work
  assets/img/ ............. your photos
  assets/video/ ........... your videos + their preview images
  favicon.svg ............. the little icon in the browser tab
  _originals/ ............. backup copies of your original photos/videos
                            (NOT used by the site — safe to keep or delete)


------------------------------------------------------------
  STEP 1 — PREVIEW THE SITE ON YOUR COMPUTER
------------------------------------------------------------
IMPORTANT: If you just double-click "index.html", the page will mostly
work BUT the videos and the contact form may look broken. That is normal
for double-clicking — it is NOT a real error.

To preview it properly, open PowerShell in this folder and run ONE of these:

    npx serve

  ...then open the web address it prints (for example http://localhost:3000).

  If that doesn't work, try:

    py -m http.server 8080

  ...then open http://localhost:8080 in your browser.

To stop the preview, press Ctrl + C in the PowerShell window.

(When the site is published online — see Step 5 — everything works
normally and you don't need any of this.)


------------------------------------------------------------
  STEP 2 — CHANGE THE WORDS (bio, contacts, etc.)
------------------------------------------------------------
1. Open "index.html" with any text editor (Notepad works fine).
2. Press Ctrl + F to search for the text you want to change.

Your email and phone are ALREADY filled in. To change them later, search
for the current value and replace it. Other things still to personalise:

Useful things to search for and replace:
    bondarenkoangelina778@gmail.com .. your email (already set — search to change)
    279 243 0095 ............ your phone (already set — search to change)
    12792430095 ............. your number in the call/WhatsApp links
                              (digits only, with country code, no +)
    @yourhandle ............. your Instagram / Telegram username (placeholder)
    [Your city] ............. where you are based
    [EDIT THIS] ............. your biography text
    YOURDOMAIN.com .......... your website address (after publishing)

Look for green lines that start with  <!-- EDIT ... -->  — these point
out exactly what can be changed. When editing, change the words but do
NOT delete the < > symbols around them.

3. Save the file and refresh the page to see your changes.


------------------------------------------------------------
  STEP 3 — MAKE THE BOOKING FORM SEND YOU EMAILS
------------------------------------------------------------
Out of the box, the form is NOT yet connected — if someone tries to send
it, they get a polite note asking them to email or message you instead
(those links already work). To receive form messages by email:

1. Go to  https://formspree.io  and create a free account.
2. Create a new form. It will give you a web address that looks like:
       https://formspree.io/f/abcdwxyz
3. Open index.html, press Ctrl + F and search for:
       PASTE_YOUR_FORMSPREE_URL_HERE
4. Replace it with your Formspree address (keep the quotation marks).
5. Save. Now booking requests will arrive in your email inbox.

(The free plan handles about 50 messages a month and filters spam.)


------------------------------------------------------------
  STEP 4 — SWAP PHOTOS OR VIDEOS
------------------------------------------------------------
PHOTOS:
  Put your new photo in the "assets/img" folder and give it the EXACT
  same name as the one you're replacing (for example "gallery-01.jpg"
  or "hero.jpg"). Tall "portrait" photos look best.

VIDEOS:
  The site plays files named showreel-1.mp4, showreel-2.mp4, showreel-3.mp4
  in "assets/video". Phone videos are usually ".MOV" and must be turned
  into ".mp4" for websites. If you have FFmpeg installed, open PowerShell
  in this folder and run (one line):

    ffmpeg -i "MyClip.MOV" -vf "scale=-2:1280" -c:v libx264 -preset slow -b:v 1150k -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "assets\video\showreel-1.mp4"

  And to make its preview image:

    ffmpeg -ss 00:00:01 -i "MyClip.MOV" -frames:v 1 -q:v 3 "assets\video\showreel-1.jpg"

  Easiest alternative: upload the video to YouTube or Vimeo and ask for
  help embedding it instead.


------------------------------------------------------------
  STEP 5 — PUBLISH THE SITE ONLINE (so people can visit it)
------------------------------------------------------------
EASIEST WAY — Netlify (free, no technical setup):
  1. Go to  https://app.netlify.com  and sign up (free).
  2. Open the "Sites" area.
  3. Drag THIS WHOLE FOLDER onto the upload box on the page.
  4. In a few seconds you get a free, live web address with HTTPS.
  5. To update later, just drag the folder on again.

OTHER OPTIONS:
  - GitHub Pages — free, but needs a GitHub account and a little setup.
  - Vercel — free, drag-and-drop or connect a repository.
  For any of these, the booking form needs Step 3 (Formspree) to work.

After publishing, remember to update YOURDOMAIN.com inside index.html,
robots.txt and sitemap.xml (Step 2) to your real address.

You can delete the "_originals" folder before uploading if you'd like a
smaller upload — it is only a backup of your source photos and videos.


------------------------------------------------------------
  NEED A HAND?
------------------------------------------------------------
Editing words and swapping photos is safe and easy. If you ever get stuck
with the form or publishing, those are the two steps worth asking for help
with. Enjoy your new site!
