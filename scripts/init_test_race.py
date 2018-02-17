# -*- coding: utf-8 -*-
import MySQLdb
import datetime
import time
import csv
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
print sys.stdin.encoding
print sys.stdout.encoding

def get_mysql_conn(host, db, user, passwd, port):
	conn = None
	cursor = None
	try:
		print '[mysql]: mysql -u%s -h%s -p%s -P%s -D%s' % (user, host, passwd, port, db)
		conn = MySQLdb.connect(host=host, db=db, port=port, user=user, passwd=passwd, charset='utf8')
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

def add_team(conn, cursor, tid, team_name, logo, description=''):
	sql = "select team_id from team where tid=%s limit 1"
	cursor.execute(sql, (tid, ))
	data = cursor.fetchone()
	if data:
		return data[0]
	now_ts = long('%.0f' % (time.time()*1000))
	sql = "insert ignore into team set tid=%s,team_name=%s,short_name=%s,description=%s,logo=%s,create_ts=%s,delete_ts=0"
	cursor.execute(sql, (tid, team_name, team_name, description, logo, now_ts, ))
	conn.commit()
	sql = 'select team_id from team where tid=%s limit 1'
	cursor.execute(sql, (tid, ))
	return cursor.fetchone()[0]

def add_race_info(conn, cursor, rid, race_name):
	sql = "select race_info_id from race_info where race_name=%s limit 1"
	cursor.execute(sql, (race_name, ))
	data = cursor.fetchone()
	if data:
		return data[0]
	now_ts = long('%.0f' % (time.time()*1000))
	sql = "insert ignore into race_info set rid=%s,race_name=%s,create_ts=%s"
	cursor.execute(sql, (rid, race_name, now_ts, ))
	conn.commit()
	sql = "select race_info_id from race_info where race_name=%s limit 1"
	cursor.execute(sql, (race_name, ))
	return cursor.fetchone()[0]

def add_race(conn, cursor, race_info_id, mid, team_id_a, team_id_b, dt_str):
	sql = "select race_id from race where team_id_a=%s and team_id_b=%s and dt=%s limit 1"
	cursor.execute(sql, (team_id_a, team_id_b, dt_str, ))
	data = cursor.fetchone()
	if data:
		return data[0]
	dt = datetime.datetime.strptime(dt_str,'%Y%m%d')
	ts = long('%.0f' % (time.mktime(dt.timetuple())*1000))
	now_ts = long('%.0f' % (time.time()*1000))
	sql = "insert ignore into race set race_info_id=%s,game_id=2,mid=%s,team_id_a=%s,team_id_b=%s,score_a=0,score_b=0,status='ready',create_ts=%s,race_ts=%s,dt=%s"
	cursor.execute(sql, (race_info_id, mid, team_id_a, team_id_b, now_ts, ts, dt_str, ))
	conn.commit()
	sql = "select race_id from race where team_id_a=%s and team_id_b=%s and dt=%s limit 1"
	cursor.execute(sql, (team_id_a, team_id_b, dt_str, ))
	return cursor.fetchone()[0]

def add_betting(conn, cursor, race_id, title):
	sql = "select betting_id from betting where title=%s and race_id=%s limit 1"
	cursor.execute(sql, (title, race_id, ))
	data = cursor.fetchone()
	if data:
		return data[0]
	now_ts = long('%.0f' % (time.time()*1000))
	sql = "insert ignore into betting set title=%s,race_id=%s,create_ts=%s,tp=0"
	cursor.execute(sql, (title, race_id, now_ts, ))
	conn.commit()
	sql = "select betting_id from betting where title=%s and race_id=%s limit 1"
	cursor.execute(sql, (title, race_id, ))
	return cursor.fetchone()[0]

def add_betting_item(conn, cursor, betting_id, title):
	sql = "select betting_item_id from betting_item where betting_id=%s and title=%s"
	cursor.execute(sql, (betting_id, title, ))
	data = cursor.fetchone()
	if data:
		return data[0]
	now_ts = long('%.0f' % (time.time()*1000))
	sql = "insert ignore into betting_item set betting_id=%s,title=%s,odds=1,create_ts=%s,status='unknown'"
	cursor.execute(sql, (betting_id, title, now_ts, ))
	conn.commit()
	sql = "select betting_item_id from betting_item where betting_id=%s and title=%s"
	cursor.execute(sql, (betting_id, title, ))
	return cursor.fetchone()[0]

def main():
	conn, cursor = get_mysql_conn('localhost', 'scratcloud', 'root', '', 3306)
	team_id_1 = add_team(conn, cursor, 'gogo1', 'TeamA', 'http://dl2.img.3iuu.com/attachments/7bbc/8b70/6f8edc68855a0eb50b1156de/1494419398920.jpg')
	team_id_2 = add_team(conn, cursor, 'gogo2', 'TeamB', 'http://dl2.img.3iuu.com/attachments/ea03/61a9/a087353719ac49f29b563c9f/1494419408721.jpg')
	race_info_id = add_race_info(conn, cursor, 'gogo1', '内测比赛')
	race_id = add_race(conn, cursor, race_info_id, 'gogo1', 'gogo1', 'gogo2', '20180401')
	
	betting_id_1 = add_betting(conn, cursor, race_id, '对局总数')
	print add_betting_item(conn, cursor, betting_id_1, '2局')
	print add_betting_item(conn, cursor, betting_id_1, '3局')

	betting_id_2 = add_betting(conn, cursor, race_id, '最终比分')
	print add_betting_item(conn, cursor, betting_id_2, '2 - 0')
	print add_betting_item(conn, cursor, betting_id_2, '2 - 1')
	print add_betting_item(conn, cursor, betting_id_2, '1 - 2')
	print add_betting_item(conn, cursor, betting_id_2, '0 - 2')

	betting_id_3 = add_betting(conn, cursor, race_id, '最终获胜')
	print add_betting_item(conn, cursor, betting_id_3, 'TeamA')
	print add_betting_item(conn, cursor, betting_id_3, 'TeamB')
	
	close_mysal_conn(conn, cursor)

if __name__ == '__main__':
	main()



