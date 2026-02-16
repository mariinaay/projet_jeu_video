# Documentation API – Jeu Vidéo Komodo

Toutes les routes REST pour le backend du jeu sont documentées avec :  

`{ method, path, auth?, roles, params, return format, possible statuses }`

# Auth

Register
{ method: POST, path: /api/auth/register, auth?: public, roles: public, params: { username, email, password }, return format: { message, userId }, possible statuses: 201, 400, 409, 500 }

Login
{ method: POST, path: /api/auth/login, auth?: public, roles: public, params: { email, password }, return format: { token, userId, role }, possible statuses: 200, 401, 404, 500 }

# Players

Get all players
{ method: GET, path: /api/players, auth?: requis, roles: admin, params: –, return format: [ { id, user_id, display_name, level, experience_points, created_at } ], possible statuses: 200, 401, 403, 404, 500 }

Create player
{ method: POST, path: /api/players, auth?: requis, roles: admin, player, params: { user_id, display_name }, return format: { message, id }, possible statuses: 201, 400, 401, 403, 500 }

# Characters

Get characters by player
{ method: GET, path: /api/characters/:player_id, auth?: requis, roles: admin, player, params: player_id (URL param), return format: [ { id, player_id, name, class, level, health, mana, created_at } ], possible statuses: 200, 400, 401, 403, 404, 500 }

Create character
{ method: POST, path: /api/characters, auth?: requis, roles: admin, player, params: { player_id, name, classType }, return format: { message, characterId }, possible statuses: 201, 400, 401, 403, 500 }

# Items

Get all items
{ method: GET, path: /api/items, auth?: requis, roles: admin, player, params: –, return format: [ { id, name, item_type, rarity, base_stats, price, created_at } ], possible statuses: 200, 401, 404, 500 }

Add item to inventory
{ method: POST, path: /api/items/inventory, auth?: requis, roles: player, params: { inventory_id, item_id, quantity }, return format: { message, id }, possible statuses: 201, 400, 401, 403, 500 }

# Game Rooms

Get all game rooms
{ method: GET, path: /api/gamerooms, auth?: requis, roles: admin, player, params: –, return format: [ { id, name, max_players, current_players, game_mode, difficulty, status, owner_id, created_at } ], possible statuses: 200, 401, 403, 404, 500 }

Create game room
{ method: POST, path: /api/gamerooms, auth?: requis, roles: player, params: { name, max_players, game_mode, difficulty, owner_id }, return format: { message, id }, possible statuses: 201, 400, 401, 403, 500 }

# Leaderboard

Get leaderboard
{ method: GET, path: /api/leaderboard, auth?: requis, roles: admin, player, params: –, return format: [ { id, player_id, rank_, total_score, total_wins, total_kills, win_ratio, updated_at } ], possible statuses: 200, 401, 404, 500 }

# Chat

Send message
{ method: POST, path: /api/chat, auth?: requis, roles: player, params: { sender_id, room_id, message_text }, return format: { message, id }, possible statuses: 201, 400, 401, 403, 500 }

Get messages by room
{ method: GET, path: /api/chat/:room_id, auth?: requis, roles: admin, player, params: room_id (URL param), return format: [ { id, sender_id, room_id, message_text, created_at, is_read } ], possible statuses: 200, 400, 401, 403, 404, 500 }

# Achievements

Get all achievements
{ method: GET, path: /api/achievements, auth?: requis, roles: admin, player, params: –, return format: [ { id, name, description, icon_url, reward_points, requirement_type, requirement_value, created_at } ], possible statuses: 200, 401, 404, 500 }

Unlock achievement
{ method: POST, path: /api/achievements/unlock, auth?: requis, roles: player, params: { player_id, achievement_id }, return format: { message, id }, possible statuses: 201, 400, 401, 403, 500 }