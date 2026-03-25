
alter table players
add column if not exists status VARCHAR(255) default 'A',
add column if not exists eliagible_positions VARCHAR(255)[],
add column if not exists primary_position VARCHAR(255);
