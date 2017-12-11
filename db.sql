create database if not exists scratcloud default character set utf8;
create user 'scrat'@'localhost' identified by 'scrat';
grant select,insert,update on scratcloud.* to scrat@'localhost';
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
qq_openid varchar(32) not null default '',
wx_openid varchar(32) not null default '',
wx_unionid varchar(32) not null default '',
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
video varchar(512) not null default '',
game enum('wangzhe', 'chicken') not null default 'wangzhe',
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
team_id_a varchar(16) not null default '',
team_id_b varchar(16) not null default '',
score_a varchar(8) not null default '0',
score_b varchar(8) not null default '0',
status enum('end', 'holding', 'ready') not null default 'end',
race_ts bigint unsigned not null default 0,
dt int unsigned not null default 0 comment '如：20171101',
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(race_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table coin (
coin_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
create_ts bigint unsigned not null default 0,
primary key(coin_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table coin_plan (
coin_plan_id int unsigned not null auto_increment comment '自增主键',
fee int unsigned not null default 0 comment '单位分',
coin_count int unsigned not null default 0,
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(coin_plan_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

insert ignore into coin_plan set fee=600,coin_count=400,create_ts=unix_timestamp(now())*1000;
insert ignore into coin_plan set fee=3000,coin_count=600,create_ts=unix_timestamp(now())*1000;
insert ignore into coin_plan set fee=6800,coin_count=1000,create_ts=unix_timestamp(now())*1000;
insert ignore into coin_plan set fee=12800,coin_count=30000,create_ts=unix_timestamp(now())*1000;

create table order_info (
order_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
out_trade_no varchar(32) not null default '',
tp enum('coin_plan') not null default 'coin_plan',
tp_id int unsigned not null default 0,
fee int unsigned not null default 0 comment '单位分',
pay_pt enum('alipay', 'weixin') not null default 'alipay',
status enum('unpaid', 'paid') not null default 'unpaid',
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
unique key(out_trade_no),
primary key(order_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table user_coin (
user_coin_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
coin_count int unsigned not null default 0,
create_ts bigint unsigned not null default 0,
update_ts bigint unsigned not null default 0,
unique key(uid),
primary key(user_coin_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table coin_history (
history_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
coin_count int unsigned not null default 0,
tp enum('buy_coin', 'guess', 'gift', 'exchange', 'betting') not null default 'gift',
tp_id int unsigned not null default 0,
create_ts bigint unsigned not null default 0,
primary key(history_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table goods (
goods_id int unsigned not null auto_increment comment '自增主键',
tp varchar(16) not null default '',
cover varchar(512) not null default '',
title varchar(128) not null default '',
description text not null,
coin int unsigned not null default 0,
total int unsigned not null default 0,
max_per_buy int unsigned not null default 1,
expired_ts bigint unsigned not null default 0,
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(goods_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--equipment 装备
--lucky_money 红包
--game_around 游戏周边
--virtual 虚拟物品

insert ignore into goods set cover='http://game.gtimg.cn/images/yxzj/web201605/page/pf_img1.png', tp='equipment', title='专属皮肤', description='兑换阿珂专属皮肤', coin=1000, total=100, create_ts=unix_timestamp(now())*1000, expired_ts=unix_timestamp(now())*1000+100000000;

create table goods_order (
goods_order_id int unsigned not null auto_increment comment '自增主键',
goods_id int unsigned not null default 0,
uid char(16) not null default '',
status enum('apply', 'done') not null default 'apply',
create_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(goods_order_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table address (
address_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
tel varchar(11) not null default '',
receiver varchar(32) not null default '',
location varchar(128) not null default '',
address_detail varchar(512) not null default '',
create_ts bigint unsigned not null default 0,
update_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(address_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table betting (
betting_id int unsigned not null auto_increment comment '自增主键',
title varchar(128) not null default '',
race_id int unsigned not null default 0,
expired_ts bigint unsigned not null default 0,
tp varchar(16) not null default '',
create_ts bigint unsigned not null default 0,
update_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(betting_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table betting_item (
betting_item_id int unsigned not null auto_increment comment '自增主键',
betting_id int unsigned not null default 0,
title varchar(128) not null default '',
odds float unsigned not null default 1,
status enum('unknown', 'win', 'lose') not null default 'unknown',
create_ts bigint unsigned not null default 0,
update_ts bigint unsigned not null default 0,
delete_ts bigint unsigned not null default 0,
primary key(betting_item_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table user_betting (
user_betting_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
betting_item_ids varchar(128) not null default '',
coin int unsigned not null default 0,
odds float unsigned not null default 1,
status enum ('apply', 'win', 'lose', 'invalid') not null default 'apply',
create_ts bigint unsigned not null default 0,
primary key(user_betting_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table feedback (
feedback_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
title varchar(64) not null default '',
content text not null,
app_key char(16) not null default '',
ver_code varchar(16) not null default '',
ver_name varchar(16) not null default '',
create_ts bigint unsigned not null default 0,
primary key(feedback_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table feedback_img (
feedback_img_id int unsigned not null auto_increment comment '自增主键',
feedback_id int unsigned not null default 0,
url varchar(522) not null default '',
primary key(feedback_img_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table news_like (
news_like_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
news_id int unsigned not null default 0,
create_ts bigint unsigned not null default 0,
unique key (uid, news_id),
primary key(news_like_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table comment_like (
comment_like_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
comment_id int unsigned not null default 0,
create_ts bigint unsigned not null default 0,
unique key (uid, comment_id),
primary key(comment_like_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

create table sign_in (
sign_in_id int unsigned not null auto_increment comment '自增主键',
uid char(16) not null default '',
dt char(8) not null default '',
create_ts bigint unsigned not null default 0,
unique key(uid, dt),
primary key(sign_in_id)
) engine=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;