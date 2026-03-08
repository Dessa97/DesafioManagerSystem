-- Inserir usuários iniciais
INSERT INTO usuarios (login, senha, nome, administrador) VALUES 
('convidado', '$2b$10$N0aiFDiPk41oPdLZMbfEXuyUpLD11ccD4FATveWHpiLmP87rkgLPG', 'Usuário convidado', false),
('admin', '$2b$10$.7y4zWxcUw0q0fqiGpvvy.hshvH9DsS/sw1hvh.Soooj8b.7SzFey', 'Gestor', true);

-- Inserir países iniciais
INSERT INTO paises (nome, sigla, gentilico) VALUES 
('Brasil', 'BR', 'Brasileiro'),
('Argentina', 'AR', 'Argentino'),
('Alemanha', 'AL', 'Alemão');
