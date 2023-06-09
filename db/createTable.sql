create table tbl_admin
(
	id 				int(11) primary key,
	name 			varchar(255),
	password 		varchar(255),
	email 			varchar(255),
	account 		varchar(255),
	type 		    tinyint(1),
	role_id 		int(11),
	refresh_token 	varchar(255),
	active 			tinyint(1),
	expired_on 		bigint(20),
	created_at 		bigint(20),
	updated_at 		bigint(20)
)

create table tbl_role
(
	id 				int(11) primary key,
	name 			varchar(255),
	publish			tinyint(1),
	created_at 		bigint(20),
	updated_at 		bigint(20)
)

create table tbl_user
(
	id 					int(11) primary key,
	userName 			varchar(255),
	roomName			varchar(255),
	active				tinyint(1),
	created_at 			bigint(20),
	updated_at 			bigint(20)
)

create table tbl_room
(
	id 					int(11) primary key,
	roomName			varchar(255),
	active				tinyint(1),
	created_at 			bigint(20),
	updated_at 			bigint(20)
)

create table tbl_chat
(
	id 					int(11) primary key,
	roomID 				int(11),
	userID 				int(11),
	created_at 			bigint(20),
)