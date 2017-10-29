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

def insert_into_news(conn, cursor, nid, title, tp, news_ts, cover, url, body, view_count):
	sql = 'select count(1) from news where nid=%s'
	print sql
	cursor.execute(sql, (nid,))
	count = cursor.fetchone()[0]
	if count > 0:
		print 'already exist', nid
		sql = 'update news set title=%s, tp=%s, news_ts=%s, cover=%s, url=%s, body=%s, view_count=%s where nid=%s'
		print sql
		cursor.execute(sql, (title, tp, news_ts, cover, url, body, nid, view_count, ))
		conn.commit()
		return
	sql = 'insert ignore into news set nid=%s, title=%s, tp=%s, news_ts=%s, cover=%s, url=%s, body=%s, view_count=%s'
	print sql
	cursor.execute(sql, (nid, title, tp, news_ts, cover, url, body, view_count, ))
	conn.commit()

def get_video_html(url):
	return '<video controls="" autoplay="" name="media"><source src="%s" type="video/mp4"></video>' % url

def get_news(page):
	if not page:
		page = 1
	res = []
	lines = command("curl 'http://tgl.qq.com/api/tglStatic/list/search.js?gid=362&from=SCXL&order=top&cid=2140&page=%s&pagesize=6' -H 'Origin: http://pvp.qq.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: application/json' -H 'Referer: http://pvp.qq.com/ingame/all/matchCenter/index.shtml?match_id=8' -H 'Connection: keep-alive' --compressed" % page)
	datas = json.loads(lines[0]).get('msg').get('result')
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
		if content == '' and video_id != '':
			content = get_video_html('http://120.198.235.230/ugcyd.qq.com/flv/226/45/%s.mp4' % video_id)
		# print info_id, title, tp, ts, img, jump_url, content
		res.append((info_id, title, tp, ts,  img, jump_url, content, view_count))
	return res

def parse_news(conn, cursor):
	for x in xrange(1,2):
		print x
		datas = get_news(x)
		for data in datas:
			(nid, title, tp, news_ts, cover, url, body, view_count) = data
			insert_into_news(conn, cursor, nid, title, tp, news_ts, cover, url, body, view_count)

def insert_into_team(conn, cursor, tid, team_name, description, logo, short_name):
	sql = 'select count(1) from team where tid=%s'
	print sql
	cursor.execute(sql, (tid,))
	count = cursor.fetchone()[0]
	if count > 0:
		sql = 'update team set team_name=%s, description=%s, logo=%s, short_name=%s where tid=%s'
		print sql
		cursor.execute(sql, (team_name, description, logo, short_name, tid, ))
		conn.commit()
		return
	now_ts = time.time()*1000
	sql = 'insert ignore into team set tid=%s, team_name=%s, description=%s, logo=%s, short_name=%s, create_ts=%s'
	print sql
	cursor.execute(sql, (tid, team_name, description, logo, short_name, now_ts, ))
	conn.commit()

def insert_into_team_member(conn, cursor, tid, mid, member_name, description, avatar):
	sql = 'select count(1) from team_member where tid=%s and mid=%s'
	print sql
	cursor.execute(sql, (tid, mid, ))
	count = cursor.fetchone()[0]
	if count > 0:
		sql = 'update team_member set member_name=%s, description=%s, avatar=%s where tid=%s and mid=%s'
		print sql
		cursor.execute(sql, (member_name, description, avatar, tid, mid, ))
		conn.commit()
		return
	now_ts = time.time()*1000
	sql = 'insert ignore into team_member set member_name=%s, description=%s, avatar=%s, tid=%s, mid=%s, create_ts=%s'
	print sql
	cursor.execute(sql, (member_name, description, avatar, tid, mid, now_ts, ))
	conn.commit()

def parse_team_member(conn, cursor, tid):
	now_ts = time.time()*1000
	lines = command("curl 'http://pvp.ingame.qq.com/php/ingame/smobamatch/guild_players.php?match_id=8&src=ingame&game=smoba&loading=true&tips=true&guildid=%s&_=%s'" % (tid, now_ts))
	members = json.loads(lines[0]).get('data').get('memberllist')
	for member in members:
		mid = member.get('memberid')
		member_name = member.get('membername')
		description = member.get('memberdesc')
		avatar = 'http:' + member.get('membericon')
		insert_into_team_member(conn, cursor, tid, mid, member_name, description, avatar)

def parse_team_list(conn, cursor):
	now_ts = time.time()*1000
	lines = command("curl 'http://itea-cdn.qq.com/file/ingame/smoba/matchteaminfo8.json?callback=%%3F&t=%s&loading=true' -H 'Origin: http://pvp.qq.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: application/json' -H 'Referer: http://pvp.qq.com/ingame/all/matchCenter/index.shtml?match_id=8' -H 'Connection: keep-alive' --compressed" % now_ts)
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
		insert_into_team(conn, cursor, tid, team_name, description, logo, short_name)
		parse_team_member(conn, cursor, tid)

def get_race():
	now_ts = time.time()*1000

	# lines = command("curl 'http://itea-cdn.qq.com/file/ingame/smoba/matchcate8.json?callback=%%3F&t=%s&loading=true' -H 'Origin: http://pvp.qq.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' -H 'Accept: application/json' -H 'Referer: http://pvp.qq.com/ingame/all/matchCenter/index.shtml?match_id=8' -H 'Connection: keep-alive' --compressed" % now_ts)
	# print lines[0]

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
	# parse_news(conn, cursor)
	parse_team_list(conn, cursor)
	close_mysal_conn(conn, cursor)

if __name__ == '__main__':
	main()
