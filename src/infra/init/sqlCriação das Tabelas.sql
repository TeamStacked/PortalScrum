drop table if exists exame cascade;
drop table if exists questao cascade;
drop table if exists resposta cascade;
drop table if exists modulo cascade;
drop table if exists usuario cascade;

create table usuario(
	id_usuario serial primary key,
	cpf_usuario varchar(15)unique,
	nome_usuario varchar(100)not null,
	email_usuario varchar(100)unique,
	senha_usuario varchar(200)not null,
	certificado_hash varchar(255) not null
);

create table modulo(
	id_modulo serial primary key,
	titulo_modulo varchar(255) not null
);

create table exame(
	id_exame serial primary key,
	id_modulo int references modulo(id_modulo),
	id_usuario int references usuario(id_usuario),
	grupo_exame int not null,
	tentativa_exame smallint check (tentativa_exame>0 and tentativa_exame<3)
);

create table questao(
	id_questao serial primary key,
	id_modulo int references modulo(id_modulo),
	grupo_questao int not null,
	numero_questao int not null,
	dificuldade_questao varchar(50) not null,
	enunciado_questao text not null,
	alternativaCorreta_questao char(1) not null,
	alternativaA_questao text not null,
	alternativaB_questao text not null,
	alternativaC_questao text not null,
	alternativaD_questao text not null,
	imagem_questao varchar(255)
);

create table resposta(
	id_resposta serial primary key,
	id_questao int references modulo(id_modulo),
	id_exame int references exame(id_exame),
	nota_resposta smallint not null,
	alternativa_resposta char(1) not null,
	TempoResposta timestamp not null
);


