create database if not exists scratcloud default character set utf8;
create user 'scrat'@'localhost' identified by 'scrat';
grant select,insert,update,delete,create,alter on scratcloud.* to scrat@'localhost';
flush privileges;
use scratcloud;

create table app (
app_id int unsigned not null auto_increment comment '自增主键',
app_key char(16) not null default '',
app_secret char(32) not null default '',
app_name varchar(32) not null default '',
create_ts bigint unsigned not null default 0,
update_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(app_id)
) engine=MyISAM default charset=utf8;

insert ignore into app set app_key='test_key',app_secret='test_secret',create_ts=1508147082687;

create table sms (
sms_id int unsigned not null auto_increment comment '自增主键',
tel char(11) not null default '',
code varchar(8) not null default '',
create_ts bigint unsigned not null default 0,
expired_ts bigint unsigned not null default 0,
primary key (sms_id)
) engine=InnoDB default charset=utf8;

create table account (
account_id int unsigned not null auto_increment comment '自增主键',
app_id int unsigned not null default 0,
uid char(16) not null default '' comment '用户ID',
tel char(11) not null default '',
wx_openid varchar(32) not null default '',
username varchar(32) not null default '' comment '用户姓名',
pwd varchar(32) not null default '',
gender enum('unknown', 'male', 'female') not null default 'unknown',
avatar varchar(512) not null default '',
create_ts bigint unsigned not null default 0,
update_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
unique key(uid),
primary key(account_id)
) engine=InnoDB default charset=utf8;

create table refresh_token (
token_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
token char(16) not null default '',
scope enum('app', 'weixin', 'web') not null default 'app',
expired_ts bigint unsigned not null default 0,
create_ts bigint unsigned not null default 0,
unique key(uid, token),
primary key(token_id)
) engine=InnoDB default charset=utf8;

create table access_token (
token_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
token char(16) not null default '',
scope enum('app', 'weixin', 'web') not null default 'app',
expired_ts bigint unsigned not null default 0,
create_ts bigint unsigned not null default 0,
unique key(uid, token),
primary key(token_id)
) engine=InnoDB default charset=utf8;

create table news (
news_id int unsigned not null auto_increment comment '自增主键',
nid int unsigned not null default 0 comment '对应iInfoId',
title varchar(64) not null default '' comment '对应sInfoTitle',
tp varchar(32) not null default '' comment '对应iInfoType',
news_ts bigint unsigned not null default 0 comment '对应iInfoTime',
view_count int unsigned not null default 0 comment 'iInfoPv||iInfoVv',
cover varchar(512) not null default '' comment '对应iInfoImg',
url varchar(512) not null default '' comment '对应infoJumpUrl',
body text not null comment '对应inforContent',
unique key(nid),
primary key(news_id)
) engine=InnoDB default charset=utf8;

create table comment (
comment_id int unsigned not null auto_increment comment '自增主键',
replay_comment_id int unsigned not null default 0,
uid char(16) not null default '',
tp enum('news', 'race') not null default 'news' comment 'news: 新闻评论；race：赛事评论',
target_id int unsigned not null default 0,
content varchar(512) not null default '',
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(comment_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table team (
team_id int unsigned not null auto_increment comment '自增主键',
tid varchar(16) not null default '' comment '对应id',
team_name varchar(32) not null default '' comment '对应name',
short_name varchar(32) not null default '' comment '对应shortname',
description varchar(512) not null default '' comment '对应descr',
logo varchar(512) not null default '' comment '战队封面',
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(team_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table team_member (
member_id int unsigned not null auto_increment comment '自增主键',
team_id int unsigned not null default 0,
tid varchar(16) not null default '',
mid varchar(16) not null default '' comment '对应memberid',
member_name varchar(32) not null default '' comment '对应membername',
avatar varchar(512) not null default '' comment '对应membericon',
description varchar(512) not null default '' comment '对应membericon',
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(member_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table game (
game_id int unsigned not null auto_increment comment '自增主键',
gid varchar(16) not null default '',
title varchar(128) not null default '',
logo varchar(512) not null default '',
reward text not null,
rule varchar(512) not null default '',
game_ts bigint unsigned not null default 0,
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(game_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table race_info (
race_info_id int unsigned not null auto_increment comment '自增主键',
rid varchar(16) not null default '',
race_name varchar(32) not null default '',
description varchar(512) not null default '',
start_ts bigint unsigned not null default 0,
end_ts bigint unsigned not null default 0,
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(race_info_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table race (
race_id int unsigned not null auto_increment comment '自增主键',
race_info_id int unsigned not null default 0,
game_id int unsigned not null default 0,
mid varchar(16) not null default '',
team_id_a int unsigned not null default 0,
team_id_b int unsigned not null default 0,
score_a varchar(8) not null default '0',
score_b varchar(8) not null default '0',
status enum('end', 'holding', 'ready') not null default 'end',
race_ts bigint unsigned not null default 0,
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(race_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;