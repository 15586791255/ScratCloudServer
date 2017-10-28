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

