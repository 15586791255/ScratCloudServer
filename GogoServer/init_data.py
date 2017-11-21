# -*- coding: utf-8 -*-
import datetime
import os
import time
import json
import urllib
import urllib2
import sys
import redis
import MySQLdb
import requests
from bs4 import BeautifulSoup
reload(sys)
sys.setdefaultencoding('utf-8')
print sys.stdin.encoding
print sys.stdout.encoding

host = 'localhost'
db = 'scratcloud'
user = 'scrat'
passwd = 'scrat'

user = 'root'
passwd = ''

def http_get(url):
	print '[GET]:', url
	req = urllib2.Request(url=url, headers={
		'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
		'Upgrade-Insecure-Requests': '1',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'Cache-Control': 'max-age=0',
		'Cookie': 'UM_distinctid=15dd74c1eb36f9-056fcd47cdfb6b-30627808-13c680-15dd74c1eb49e2; CNZZDATA30085248=cnzz_eid%3D533246602-1502551639-%26ntime%3D1502553093; CNZZDATA30077640=cnzz_eid%3D1749570782-1502553547-%26ntime%3D1502553547',
		'Connection': 'keep-alive'
		})
	response = urllib2.urlopen(req)
	response_data = response.read()
	# print len(response_data)
	# print response_data
	return response_data

def http_post(url, params):
	print '[POST]:', url, params
	data = urllib.urlencode(params)
	req = urllib2.Request(url = url, data = data)
	response = urllib2.urlopen(req)
	response_data = response.read()
	print response_data
	return response_data

def http_post_json(url, params):
	print '[POST]:', url, params
	data = json.dumps(params)
	req = urllib2.Request(url = url, data = data, headers = {'Content-Type': 'application/json', 'Content-Length': len(data)})
	response = urllib2.urlopen(req)
	response_data = response.read()
	print response_data
	return response_data

def get_mysql_conn(host, db, user, passwd):
	conn = None
	cursor = None
	try:
		conn = MySQLdb.connect(host=host, db=db, user=user, passwd=passwd, charset='utf8')
		print '[mysql]: mysql -u%s -h%s -D%s -p%s' % (user, host, db, passwd)
		cursor = conn.cursor()
	except Exception, e:
		print e
		conn = None
		cursor = None
	return conn, cursor

def close_mysal_conn(conn, cursor):
	if cursor:
		cursor.close()
	if conn:
		conn.close()
	conn = None
	cursor = None

def command(cmd):
	print cmd
	lines = os.popen(cmd).readlines()
	return lines

def get_redis_conn(host, port, password):
	return redis.StrictRedis(host=host, port=port, password=password)

# def get_news(url, tmp_path):
# 	cmd = 'curl %s > %s' % (url, tmp_path)
# 	command(cmd)
# 	soup = BeautifulSoup(open(tmp_path, "r").read(), 'html.parser')

	# art_lists = soup.find_all('a', 'art_word')
	# host = 'http://pvp.qq.com'
	# datas = []
	# for art in art_lists:
	# 	new_detail_url = host + art['href']
	# 	# print art.string
	# 	detail = get_news_detail(new_detail_url, tmp_path)
	# 	file_name = get_html_name(new_detail_url)
	# 	file_path = file_base_path + '/' + file_name
	# 	# print file_path
	# 	write_to_file(detail, file_path)
	# 	url_path = url_base_path + '/' + file_name
	# 	datas.append({'title': art.string, 'url': url_path})
	# next_page = soup.find('a', 'fr')
	# next_url = host + next_page['href']
	# return next_url, datas

def insert_into_news(conn, cursor, nid, title, tp, news_ts, cover, url, body, view_count, video):
	if '' == body and '' == video:
		return
	sql = 'select count(1) from news where nid=%s'
	# print sql
	cursor.execute(sql, (nid,))
	count = cursor.fetchone()[0]
	if count > 0:
		print 'already exist', nid
		sql = 'update news set title=%s, tp=%s, news_ts=%s, cover=%s, url=%s, body=%s, view_count=%s, video=%s where nid=%s'
		# print sql
		cursor.execute(sql, (title, tp, news_ts, cover, url, body, nid, video, view_count, ))
		conn.commit()
		return
	sql = 'insert ignore into news set nid=%s, title=%s, tp=%s, news_ts=%s, cover=%s, url=%s, body=%s, view_count=%s, video=%s'
	# print sql
	cursor.execute(sql, (nid, title, tp, news_ts, cover, url, body, view_count, video, ))
	conn.commit()

def get_video_html(url):
	return '<video controls="" autoplay="" name="media"><source src="%s" type="video/mp4"></video>' % url

def get_news(page):
	if not page:
		page = 1
	res = []
	res_datas = command_to_json("curl --connect-timeout 10 'http://tgl.qq.com/api/tglStatic/list/search.js?gid=362&from=SCXL&order=top&cid=2140&page=%s&pagesize=6' -H 'Origin: http://pvp.qq.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: application/json' -H 'Referer: http://pvp.qq.com/ingame/all/matchCenter/index.shtml?match_id=8' -H 'Connection: keep-alive' --compressed" % page)
	datas = res_datas.get('msg').get('result')
	for data in datas:
		info_id = data.get('iInfoId')
		title = data.get('sInfoTitle')
		img = data.get('iInfoImg')
		tp = data.get('iInfoType')
		pv = data.get('iInfoPv')
		vv = data.get('iInfoVv')
		view_count = pv
		if vv > pv:
			view_count = vv
		dt = datetime.datetime.strptime(data.get('iInfoTime'), '%Y-%m-%d %H:%M:%S')
		ts = '%.0f' % (time.mktime(dt.timetuple()) * 1000)
		detail_url = 'http:' + urllib.unquote(data.get('sInfoDetail').replace('//pvp.qq.com/tgl/detail.shtml?dt=', ''))
		detail_json_data = command("curl '%s'" % detail_url)[0].split('callback(')[1][:-1]
		detail_data = json.loads(detail_json_data)
		jump_url = detail_data.get('infoJumpUrl')
		video_id = detail_data.get('infoVid')
		content = detail_data.get('inforContent')
		video = ''
		if video_id != '':
			video = 'http://120.198.235.230/ugcyd.qq.com/flv/226/45/%s.mp4' % video_id
		# print info_id, title, tp, ts, img, jump_url, content
		res.append((info_id, title, tp, ts,  img, jump_url, content, view_count, video))
	return res

def parse_news(conn, cursor):
	for x in xrange(1,5):
		print x
		datas = get_news(x)
		for data in datas:
			(nid, title, tp, news_ts, cover, url, body, view_count, video) = data
			insert_into_news(conn, cursor, nid, title, tp, news_ts, cover, url, body, view_count, video)

def insert_into_team(conn, cursor, tid, team_name, description, logo, short_name):
	sql = 'select team_id from team where tid=%s'
	# print sql
	cursor.execute(sql, (tid,))
	team_id = 0
	record = cursor.fetchone()
	if record:
		team_id = record[0]
	if team_id > 0:
		sql = 'update team set team_name=%s, description=%s, logo=%s, short_name=%s where tid=%s'
		# print sql
		cursor.execute(sql, (team_name, description, logo, short_name, tid, ))
		conn.commit()
		return team_id
	now_ts = time.time()*1000
	sql = 'insert ignore into team set tid=%s, team_name=%s, description=%s, logo=%s, short_name=%s, create_ts=%s'
	# print sql
	cursor.execute(sql, (tid, team_name, description, logo, short_name, now_ts, ))
	conn.commit()

	sql = 'select team_id from team where tid=%s'
	# print sql
	cursor.execute(sql, (tid,))
	return cursor.fetchone()[0]

def insert_into_team_member(conn, cursor, team_id, tid, mid, member_name, description, avatar):
	sql = 'select count(1) from team_member where tid=%s and mid=%s'
	# print sql
	cursor.execute(sql, (tid, mid, ))
	count = cursor.fetchone()[0]
	if count > 0:
		sql = 'update team_member set team_id=%s, member_name=%s, description=%s, avatar=%s where tid=%s and mid=%s'
		# print sql
		cursor.execute(sql, (team_id, member_name, description, avatar, tid, mid, ))
		conn.commit()
		return
	now_ts = time.time()*1000
	sql = 'insert ignore into team_member set team_id=%s, member_name=%s, description=%s, avatar=%s, tid=%s, mid=%s, create_ts=%s'
	# print sql
	cursor.execute(sql, (team_id, member_name, description, avatar, tid, mid, now_ts, ))
	conn.commit()

def parse_team_member(conn, cursor, team_id, tid, id):
	now_ts = time.time()*1000
	#lines = command("curl 'http://pvp.ingame.qq.com/php/ingame/smobamatch/guild_players.php?match_id=%s&src=ingame&game=smoba&callback=jsonp4&loading=true&tips=true&guildid=%s&_=%.0f' -H 'Origin: http://pvp.qq.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: application/json' -H 'Referer: http://pvp.qq.com/ingame/all/matchCenter/index.shtml?match_id=8' -H 'Connection: keep-alive' --compressed" % (id, tid, now_ts))
	lines = command("curl 'http://pvp.ingame.qq.com/php/ingame/smobamatch/guild_players.php?match_id=%s&src=ingame&game=smoba&callback=jsonp4&loading=true&tips=true&guildid=%s&_=%.0f'" % (id, tid, now_ts))
	members = json.loads(lines[0].replace('jsonp4(', '')[:-1]).get('data').get('memberllist')
	for member in members:
		mid = member.get('memberid')
		member_name = member.get('membername')
		description = member.get('memberdesc')
		avatar = 'http:' + member.get('membericon')
		insert_into_team_member(conn, cursor, team_id, tid, mid, member_name, description, avatar)

def parse_team(conn, cursor, id):
	now_ts = time.time()*1000
	lines = command("curl 'http://itea-cdn.qq.com/file/ingame/smoba/matchteaminfo%s.json?callback=%%3F&t=%.0f&loading=true' -H 'Origin: http://pvp.qq.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: application/json' -H 'Referer: http://pvp.qq.com/ingame/all/matchCenter/index.shtml?match_id=8' -H 'Connection: keep-alive' --compressed" % (id, now_ts))
	datas = json.loads(lines[0])
	teams = datas.get('teamlist')
	for team in teams:
		tid = team.get('id')
		team_name = team.get('name')
		description = team.get('descr')
		logo = 'http:' + team.get('logo')
		short_name = team.get('shortname')
		if short_name == '':
			short_name = team_name
		team_id = insert_into_team(conn, cursor, tid, team_name, description, logo, short_name)
		parse_team_member(conn, cursor, team_id, tid, id)

def insert_into_game(conn, cursor, gid, title, logo, reward, rule, game_ts):
	sql = 'select game_id from game where gid=%s'
	# print sql
	game_id = 0
	cursor.execute(sql, (gid,))
	record = cursor.fetchone()
	if record:
		game_id = record[0]
	if game_id > 0:
		sql = 'update game set gid=%s, title=%s, logo=%s, reward=%s, rule=%s, game_ts=%s where game_id=%s'
		# print sql
		cursor.execute(sql, (gid, title, logo, reward, rule, game_ts, game_id, ))
		conn.commit()
		return game_id
	now_ts = time.time()*1000
	sql = 'insert ignore into game set gid=%s, title=%s, logo=%s, reward=%s, rule=%s, game_ts=%s, create_ts=%s'
	# print sql
	cursor.execute(sql, (gid, title, logo, reward, rule, game_ts, now_ts, ))
	conn.commit()
	sql = 'select game_id from game where gid=%s'
	# print sql
	cursor.execute(sql, (gid,))
	return cursor.fetchone()[0]

def insert_into_race_info(conn, cursor, rid, race_name, description, start_ts, end_ts):
	sql = 'select race_info_id from race_info where rid=%s'
	# print sql
	race_info_id = 0
	cursor.execute(sql, (rid,))
	record = cursor.fetchone()
	if record:
		race_info_id = record[0]
	if race_info_id > 0:
		sql = 'update race_info set race_name=%s, description=%s, start_ts=%s, end_ts=%s where rid=%s'
		# print sql
		cursor.execute(sql, (race_name, description, start_ts, end_ts, rid, ))
		conn.commit()
		return race_info_id
	now_ts = time.time()*1000
	sql = 'insert ignore into race_info set race_name=%s, description=%s, start_ts=%s, end_ts=%s, rid=%s, create_ts=%s'
	# print sql
	cursor.execute(sql, (race_name, description, start_ts, end_ts, rid, now_ts, ))
	conn.commit()
	sql = 'select race_info_id from race_info where rid=%s'
	# print sql
	cursor.execute(sql, (rid,))
	return cursor.fetchone()[0]

def insert_info_race(conn, cursor, game_id, race_info_id, mid, team_id_a, team_id_b, score_a, score_b, race_ts, status, dt_str):
	sql = 'select race_id from race where mid=%s and team_id_a=%s and team_id_b=%s'
	print sql % (mid, team_id_a, team_id_b)
	race_id = 0
	cursor.execute(sql, (mid, team_id_a, team_id_b,))
	record = cursor.fetchone()
	if record:
		race_id = record[0]
	print race_id
	if race_id > 0:
		sql = 'update race set game_id=%s, race_info_id=%s, team_id_a=%s, team_id_b=%s, score_a=%s, score_b=%s, race_ts=%s, status=%s, dt=%s where mid=%s and team_id_a=%s and team_id_b=%s'
		# print sql
		cursor.execute(sql, (game_id, race_info_id, team_id_a, team_id_b, score_a, score_b, race_ts, status, dt_str, mid, team_id_a, team_id_b,))
		conn.commit()
		return race_id
	now_ts = time.time()*1000
	sql = 'insert ignore into race set game_id=%s, race_info_id=%s, team_id_a=%s, team_id_b=%s, score_a=%s, score_b=%s, race_ts=%s, mid=%s, create_ts=%s, status=%s, dt=%s'
	# print sql
	cursor.execute(sql, (game_id, race_info_id, team_id_a, team_id_b, score_a, score_b, race_ts, mid, now_ts, status, dt_str, ))
	conn.commit()
	sql = 'select race_id from race where mid=%s and team_id_a=%s and team_id_b=%s'
	cursor.execute(sql, (mid, team_id_a, team_id_b, ))
	return cursor.fetchone()[0]

STATUS = {
	2: 'end',
	1: 'holding',
	0: 'ready'
}

def parse_race(conn, cursor, curr_id):
	now_ts = time.time()*1000
	lines = command("curl 'http://itea-cdn.qq.com/file/ingame/smoba/matchcate%s.json?callback=%%3F&t=%.0f&loading=true' -H 'Origin: http://pvp.qq.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: application/json' -H 'Referer: http://pvp.qq.com/ingame/all/matchCenter/index.shtml?match_id=8' -H 'Connection: keep-alive' --compressed" % (curr_id, now_ts))
	datas = json.loads(lines[0])
	game_info = datas.get('gameinfo')

	gid = game_info.get('id')
	title = game_info.get('title')
	dt = datetime.datetime.strptime(game_info.get('mtime'), '%Y-%m-%d')
	game_ts = '%.0f' % (time.mktime(dt.timetuple()) * 1000)
	reward = game_info.get('reward')
	logo = 'http:' + game_info.get('logo')
	rule = game_info.get('rule')
	game_id = insert_into_game(conn, cursor, gid, title, logo, reward, rule, game_ts)

	catelist = datas.get('catelist')
	for cate in catelist:
		rid = cate.get('cid')
		if rid == 0:
			continue
		race_name = cate.get('name')
		description = cate.get('descr')
		start_ts = long(cate.get('stime'))*1000
		end_ts = long(cate.get('etime'))*1000
		race_info_id = insert_into_race_info(conn, cursor, rid, race_name, description, start_ts, end_ts)

		matchlist = cate.get('matchlist')
		for match in matchlist:
			match_datas = match.get('list')
			for item in match_datas:
				mid = item.get('id')
				dt_str = item.get('mtime').split(' ')[0].replace('-', '')
				dt = datetime.datetime.strptime(item.get('mtime'), '%Y-%m-%d %H:%M')
				race_ts = '%.0f' % (time.mktime(dt.timetuple()) * 1000)
				team_id_a = item.get('teama_id')
				team_id_b = item.get('teamb_id')
				score_a = item.get('wina')
				score_b = item.get('winb')
				status = item.get('status')
				# print game_id, race_info_id, mid, team_id_a, team_id_b, score_a, score_b, race_ts
				insert_info_race(conn, cursor, game_id, race_info_id, mid, team_id_a, team_id_b, score_a, score_b, race_ts, STATUS.get(status), dt_str)

# 8: KPL；10：第三届王者城市赛；1：2017QGC夏季赛； 9 WGC精英赛 11 第三届王者校园争霸赛 7 TGA 12 2017
MACH_IDS = [8,10,1,9,11,7,12]

def parse_race_list(conn, cursor):
	for id in MACH_IDS:
		parse_race(conn, cursor, id)
	# parse_race(conn, cursor, 8)
	# parse_race(conn, cursor, 10)
	# parse_race(conn, cursor, 1)
	# parse_race(conn, cursor, 9)
	# parse_race(conn, cursor, 11)
	# parse_race(conn, cursor, 7)
	# parse_race(conn, cursor, 12)

def parse_team_list(conn, cursor):
	for id in MACH_IDS:
		parse_team(conn, cursor, id)

def main():
	# lines = command("curl 'http://itea-cdn.qq.com/file/ingame/smoba/matchlivelist8.json?callback=%%3F&t=%.1f&loading=true' -H 'Origin: http://pvp.qq.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: application/json' -H 'Referer: http://pvp.qq.com/ingame/all/matchCenter/index.shtml?match_id=8' -H 'Connection: keep-alive' --compressed" % now_ts)
	# datas = json.loads(lines[0])
	# for data in datas.get('matchlist'):
	# 	print data
	# 	data.get('status') # 1：正在直播； 0: 即将开始
	# 	start_time = data.get('stime')
	# 	logo_a = 'http:' + data.get('alogo')
	# 	team_name_a = data.get('teama')
	# 	score_a = data.get('wina')
	# 	logo_b = 'http:' + data.get('blogo')
	# 	team_name_b = data.get('teamb')
	# 	score_b = data.get('winb')
	# 	print start_time, team_name_a, score_a, team_name_b, score_b, logo_a

# ok------------
	conn, cursor = get_mysql_conn(host, db, user, passwd)
	print '\n========= parse news =========\n'
	parse_news(conn, cursor)
	print '\n========= parse teams =========\n'
	parse_team_list(conn, cursor)
	print '\n========= parse race =========\n'
	parse_race_list(conn, cursor)
	close_mysal_conn(conn, cursor)

def command_to_json(cmd):
	exception = None
	i = 0
	while (i < 5):
		try:
			lines = command(cmd)
			res_data = json.loads(lines[0])
			return res_data
		except Exception as e:
			print e
			i += 1
			print 'retry', i
			exception = e
			time.sleep(3)
	raise exception

def fanqie_tab():
	res_data = command_to_json("curl --connect-timeout 10 'https://fanqie-api.3iuu.com/game/list.do?appId=fanqie_ios_store&appVersion=12000&cid=ayy_ios_zv_AppStore&imei=73BF94B7-25FD-4A39-A79C-F595932A6423&mac=D80F264B-F5B1-4334-9429-C53D1F9E0D01&model=iPhone9%%2C1&page=1&sign=0888906e12b5f54156fdfe5950a3a532&targetVersion=10.3&udid=73BF94B7-25FD-4A39-A79C-F595932A6423'")
	datas = res_data.get('data')
	res = []
	for data in datas:
		res.append((data.get('gameName'), data.get('gameId')))
	return res

def fanqie_game(conn, cursor, game_id, db_game_id):
	res_data = command_to_json("curl --connect-timeout 10 'https://fanqie-api.3iuu.com/battle/list.do?appId=fanqie_ios_store&appVersion=12000&cid=ayy_ios_zv_AppStore&gameId=%s&history=1&imei=73BF94B7-25FD-4A39-A79C-F595932A6423&mac=D80F264B-F5B1-4334-9429-C53D1F9E0D01&model=iPhone9%%2C1&page=1&sign=518de873065cd7a46af39a1d5f508537&targetVersion=10.3&udid=73BF94B7-25FD-4A39-A79C-F595932A6423'" % game_id)
	datas = res_data.get('data')
	history_list = datas.get('historyList')
	fanqie_game_item(conn, cursor, history_list, db_game_id, 'end')
	on_going_list = datas.get('ongoingList')
	fanqie_game_item(conn, cursor, on_going_list, db_game_id, 'ready')

def fanqie_game_item(conn, cursor, game_list, db_game_id, status):
	for game in game_list:
		battle_id = game.get('battleId')
		res_data = command_to_json("curl --connect-timeout 10 'https://fanqie-api.3iuu.com/battle/detail.do?appId=fanqie_ios_store&appVersion=12000&battleId=%s&cid=ayy_ios_zv_AppStore&imei=73BF94B7-25FD-4A39-A79C-F595932A6423&mac=D80F264B-F5B1-4334-9429-C53D1F9E0D01&model=iPhone9%%2C1&sign=185a27e1b5d33c2fb6e435c9e37178d2&targetVersion=10.3&udid=73BF94B7-25FD-4A39-A79C-F595932A6423'" % battle_id)
		detail_data = res_data.get('data')

		match_id = 'fanqie%s' % detail_data.get('matchId') # race.mid

		battle_name = detail_data.get('battleName')
		game_name = detail_data.get('gameName') # game.title
		match_name = detail_data.get('matchName') # race_info.race_name
		print game_name, match_name, battle_name
		race_name = '%s-%s-%s' % (game_name, match_name, battle_name)
		race_info_id = insert_into_race_info(conn, cursor, match_id, race_name, '', 0, 0)

		game_icon = detail_data.get('gameIcon')

		team_1 = detail_data.get('team1')
		team_id_a = 'fanqie%s' % team_1.get('teamId') # team.tid race.team_id_a
		team_1_icon = team_1.get('teamIcon')
		team_1_name = team_1.get('teamName')
		score_a = team_1.get('score') # race.score_a

		insert_into_team(conn, cursor, team_id_a, team_1_name, '', team_1_icon, team_1_name)

		team_2 = detail_data.get('team2')
		team_id_b = 'fanqie%s' % team_2.get('teamId') # team.tid race.team_id_a
		team_2_icon = team_2.get('teamIcon')
		team_2_name = team_2.get('teamName')
		score_b = team_2.get('score') # race.score_a

		insert_into_team(conn, cursor, team_id_b, team_2_name, '', team_2_icon, team_2_name)

		# 2017/11/18 19:00
		dt = datetime.datetime.strptime(detail_data.get('startTime'), '%Y/%m/%d %H:%M')
		race_ts = '%.0f' % (time.mktime(dt.timetuple()) * 1000)
		dt_str = detail_data.get('startTime').split(' ')[0].replace('/', '')
		print dt_str

		race_id = insert_info_race(conn, cursor, db_game_id, race_info_id, match_id, team_id_a, team_id_b, score_a, score_b, race_ts, status, dt_str)

		for x in xrange(0,8):
			betting_tp = x
			betting_data = command_to_json("curl --connect-timeout 10 'https://fanqie-api.3iuu.com/guess/guessList.do?appId=fanqie_ios_store&appVersion=12000&battleId=%s&battleNumber=%s&cid=ayy_ios_zv_AppStore&imei=73BF94B7-25FD-4A39-A79C-F595932A6423&mac=D80F264B-F5B1-4334-9429-C53D1F9E0D01&model=iPhone9%%2C1&page=1&sign=0edc6f25779f38ec2d095e6d3a6d5efa&targetVersion=10.3&udid=73BF94B7-25FD-4A39-A79C-F595932A6423'" % (battle_id, x))
			guess_list = betting_data.get('data').get('guessList')
			for guess in guess_list:
				guess_title = guess.get('guessTitle')
				items = guess.get('items')
				betting_id = insert_into_betting(conn, cursor, guess_title, race_id, betting_tp)
				for item in items:
					item_name = item.get('itemName')
					item_rate = item.get('itemRate')
					state = item.get('state')
					betting_status = 'unknown'
					if state == -1:
						betting_status = 'lose'
					if state == 1:
						betting_status = 'win'
					insert_into_betting_item(conn, cursor, betting_id, item_name, item_rate, betting_status)

def get_betting_tp(x):
	if x == 0:
		return '总局'
	return '第%s局' % x

def insert_into_betting_item(conn, cursor, betting_id, title, odds, status):
	print betting_id, title, odds
	sql = 'select count(1) as total from betting_item where betting_id=%s and title=%s'
	cursor.execute(sql, (betting_id, title,))
	count = cursor.fetchone()[0]
	if count > 0:
		sql = 'update betting_item set status=%s where betting_id=%s and title=%s'
		cursor.execute(sql, (status, betting_id, title,))
		conn.commit()
		return
	sql = 'insert ignore into betting_item set betting_id=%s, title=%s, odds=%s, create_ts=%s'
	cursor.execute(sql, (betting_id, title, odds, time.time()*1000,))
	conn.commit()

def insert_into_betting(conn, cursor, title, race_id, betting_tp):
	print title, race_id
	sql = 'select betting_id from betting where race_id=%s and title=%s and tp=%s'
	betting_id = 0
	cursor.execute(sql, (race_id, title, betting_tp, ))
	record = cursor.fetchone()
	if record:
		betting_id = record[0]
	if betting_id > 0:
		sql = 'update betting set race_id=%s, title=%s, tp=%s where betting_id=%s'
		cursor.execute(sql, (race_id, title, betting_tp, betting_id,))
		conn.commit()
		return betting_id
	sql = 'insert ignore into betting set race_id=%s, title=%s, create_ts=%s, tp=%s'
	cursor.execute(sql, (race_id, title, time.time()*1000, betting_tp, ))
	conn.commit()
	sql = 'select betting_id from betting where race_id=%s and title=%s and tp=%s'
	cursor.execute(sql, (race_id, title, betting_tp, ))
	return cursor.fetchone()[0]

def fanqie_format_date_without_year(dt_str):
	month = int(dt_str.split('月')[0])
	year = get_curr_year()
	if month < 2 and get_curr_month() > 10:
		year += 1
	dt = datetime.datetime.strptime('%s年%s' % (year, dt_str), u'%Y年%m月%d日 %H:%M')
	return '%.0f' % (time.mktime(dt.timetuple()) * 1000)

def get_curr_year():
	return int(time.strftime('%Y',time.localtime(time.time())))

def get_next_year():
	curr_year = get_curr_year()
	return curr_year + 1

def get_curr_month():
	return int(time.strftime('%m',time.localtime(time.time())))

def insert_into_game_by_name(conn, cursor, gid, title, logo, reward, rule, game_ts):
	sql = 'select game_id from game where title=%s'
	# print sql
	game_id = 0
	cursor.execute(sql, (title,))
	record = cursor.fetchone()
	if record:
		game_id = record[0]
	if game_id > 0:
		sql = 'update game set gid=%s, title=%s, logo=%s, reward=%s, rule=%s, game_ts=%s where game_id=%s'
		# print sql
		cursor.execute(sql, (gid, title, logo, reward, rule, game_ts, game_id, ))
		conn.commit()
		return game_id
	now_ts = time.time()*1000
	sql = 'insert ignore into game set gid=%s, title=%s, logo=%s, reward=%s, rule=%s, game_ts=%s, create_ts=%s'
	# print sql
	cursor.execute(sql, (gid, title, logo, reward, rule, game_ts, now_ts, ))
	conn.commit()
	sql = 'select game_id from game where title=%s'
	# print sql
	cursor.execute(sql, (title,))
	return cursor.fetchone()[0]

def get_user_betting(conn, cursor):
	sql = "select user_betting_id,uid,betting_item_ids,coin,odds from user_betting where status='apply'"
	cursor.execute(sql)
	return cursor.fetchall()

def get_betting_status(conn, cursor, betting_item_id):
	sql = "select status from betting_item where betting_item_id=%s limit 1"
	cursor.execute(sql, (betting_item_id,))
	row = cursor.fetchone()
	if row:
		return row[0]
	return 'unknown'

def add_user_coin(conn, cursor, uid, coin, user_betting_id):
	now_ts = time.time()*1000
	sql = "insert ignore into coin_history set uid=%s,coin_count=%s,tp='guess',tp_id=%s,create_ts=%s"
	cursor.execute(sql, (uid,coin,user_betting_id,now_ts))
	conn.commit()
	sql = "update user_coin set coin_count=coin_count+%s where uid=%s"
	cursor.execute(sql, (coin, uid,))
	conn.commit()
	user_betting_status(conn, cursor, user_betting_id, 'win')

def user_betting_status(conn, cursor, user_betting_id, status):
	sql = "update user_betting set status=%s where user_betting_id=%s"
	cursor.execute(sql, (status, user_betting_id,))
	conn.commit()

def main_fanqie():
	conn, cursor = get_mysql_conn(host, db, user, passwd)
	
	parse_news(conn, cursor)

	tabs = fanqie_tab()
	for tab in tabs:
		(game_name, game_id) = tab
		db_game_id = insert_into_game_by_name(conn, cursor, game_id, game_name, '', '', '', 0)
		print db_game_id
		print '正在解析', game_name
		fanqie_game(conn, cursor, game_id, db_game_id)

	user_betting_datas = get_user_betting(conn, cursor)
	for user_betting in user_betting_datas:
		(user_betting_id,uid,betting_item_ids,coin,odds) = user_betting
		betting_item_id_arr = betting_item_ids.split(',')
		finally_result_status = 'unknown'
		for betting_item_id in betting_item_id_arr:
			betting_item_status = get_betting_status(conn, cursor, betting_item_id)
			# print user_betting_id, betting_item_id, betting_item_status
			if betting_item_status == 'lose':
				finally_result_status = 'lose'
				break
			elif betting_item_status == 'unknown':
				finally_result_status = 'unknown'
				break
			elif betting_item_status == 'win':
				finally_result_status = 'win'
		if finally_result_status == 'win':
			add_user_coin(conn, cursor, uid, int(coin*odds), user_betting_id)
		elif finally_result_status == 'lose':
			user_betting_status(conn, cursor, user_betting_id, 'win')
			
	close_mysal_conn(conn, cursor)

if __name__ == '__main__':
	main_fanqie()
