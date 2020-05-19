#!/bin/sh
echo "Seeding users"
node users.js
echo "Seeding albums"
node album.js
echo "Seeding tracks"
node track.js
echo "Seeding categories"
node category.js
echo "Seeding playlists"
node playlist.js
echo "Seeding players"
node player.js
echo "Seeding play histories"
node playHistory.js
echo "Seeding ads"
node ads.js
echo "Seeding notifications"
node notifications.js
echo "done seeding"
