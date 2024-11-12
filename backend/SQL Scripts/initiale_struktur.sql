INSERT INTO struktur (name, parent, primär_id, ordner_id, team_id, mitarbeiter_id)
VALUES 
('Monatspflege', NULL, NULL, 1, NULL, NULL), -- 1
('Administratoren', NULL, NULL, 2, NULL, NULL), -- 2
('Personen', NULL, NULL, 3, NULL, NULL), -- 3
('Hillmann & Geitz gesamt DB', 1, 1, NULL, NULL, NULL), -- 4
('DB alle AD Kunden', 1, 2, NULL, NULL, NULL), -- 5
('DB Kunden 03', 1, 3, NULL, NULL, NULL), -- 6
('DB AD Gebiet Meyer', 1, 4, NULL, NULL, NULL), -- 7
('DB Neukunden Meyer', 1, 5, NULL, NULL, NULL), -- 8
('DB Gebiet Küpker', 1, 6, NULL, NULL, NULL), -- 9
('DB Neukunden Küpker', 1, 7, NULL, NULL, NULL), -- 10
('DB Gebiet Harms', 1, 8, NULL, NULL, NULL), -- 11
('DB Neukunden Harms', 1, 9, NULL, NULL, NULL), -- 12

('Prokurist', 4, NULL, NULL, 1, NULL), -- 13
('Verkaufsteam', 4, NULL, NULL, 2, NULL), -- 14
('Buchhaltung', 4, NULL, NULL, 3, NULL), -- 15
('Verwaltung', 4, NULL, NULL, 4, NULL), -- 16
('Marketing', 4, NULL, NULL, 5, NULL), -- 17
('Lager Team', 4, NULL, NULL, 6, NULL), -- 18
('Teamleitung Lager', 4, NULL, NULL, 7, NULL), -- 19
('Innendienst Team', 5, NULL, NULL, 8, NULL), -- 20
('Team Kunden 03', 6, NULL, NULL, 9, NULL), -- 21
('AD Meyer', 7, NULL, NULL, 10, NULL), -- 22
('Neukunden AD Meyer', 8, NULL, NULL, 11, NULL), -- 23
('AD Küpker', 9, NULL, NULL, 12, NULL), -- 24
('Neukunden AD Küpker', 10, NULL, NULL, 13, NULL), -- 25
('AD Harms', 11, NULL, NULL, 14, NULL), -- 26
('Neukunden AD Harms', 12, NULL, NULL, 15, NULL), -- 27

('Noradenn, Aoulad-Ali', 18, NULL, NULL, NULL, 1),
('Noradenn, Aoulad-Ali', 19, NULL, NULL, NULL, 1),

('Ralf, Borchers', 14, NULL, NULL, NULL, 2),
('Ralf, Borchers', 20, NULL, NULL, NULL, 2),
('Ralf, Borchers', 21, NULL, NULL, NULL, 2),


('Tamara, Diego Felipe Cruz', 18, NULL, NULL, NULL, 3),

('Stefan, Gill', 16, NULL, NULL, NULL, 4),

('Matthias, Harms', 14, NULL, NULL, NULL, 5),
('Matthias, Harms', 26, NULL, NULL, NULL, 5),
('Matthias, Harms', 27, NULL, NULL, NULL, 5),

('Svenja, Harneit', 14, NULL, NULL, NULL, 6),
('Svenja, Harneit', 20, NULL, NULL, NULL, 6),
('Svenja, Harneit', 21, NULL, NULL, NULL, 6),

('Stefan, Heuermann', 15, NULL, NULL, NULL, 7),

('Stefanie, Humann', 14, NULL, NULL, NULL, 8),
('Stefanie, Humann', 20, NULL, NULL, NULL, 8),
('Stefanie, Humann', 21, NULL, NULL, NULL, 8),

('Dieter, Küpker', 14, NULL, NULL, NULL, 9),
('Dieter, Küpker', 24, NULL, NULL, NULL, 9),
('Dieter, Küpker', 25, NULL, NULL, NULL, 9),

('Andreas, Meyer', 14, NULL, NULL, NULL, 10),
('Andreas, Meyer', 22, NULL, NULL, NULL, 10),
('Andreas, Meyer', 23, NULL, NULL, NULL, 10),

('Alexander, Nielsen', 14, NULL, NULL, NULL, 11),
('Alexander, Nielsen', 20, NULL, NULL, NULL, 11),
('Alexander, Nielsen', 21, NULL, NULL, NULL, 11),

('Michael, Renken', 18, NULL, NULL, NULL, 12),

('Phillip, Schröder', 14, NULL, NULL, NULL, 13),
('Phillip, Schröder', 20, NULL, NULL, NULL, 13),
('Phillip, Schröder', 21, NULL, NULL, NULL, 13),

('Johanna, Skora', 14, NULL, NULL, NULL, 14),
('Johanna, Skora', 17, NULL, NULL, NULL, 14),

('Michael, Skora', 13, NULL, NULL, NULL, 15),
('Michael, Skora', 14, NULL, NULL, NULL, 15),
('Michael, Skora', 20, NULL, NULL, NULL, 15),
('Michael, Skora', 21, NULL, NULL, NULL, 15),

('N.N., N.N', 14, NULL, NULL, NULL, 16),
('N.N., N.N', 18, NULL, NULL, NULL, 16),
('N.N., N.N', 20, NULL, NULL, NULL, 16),
('N.N., N.N', 21, NULL, NULL, NULL, 16),

-- Personen

('Noradenn, Aoulad-Ali', 3, NULL, NULL, NULL, 1),
('Ralf, Borchers', 3, NULL, NULL, NULL, 2),
('Tamara, Diego Felipe Cruz', 3, NULL, NULL, NULL, 3),
('Stefan, Gill', 3, NULL, NULL, NULL, 4),
('Matthias, Harms', 3, NULL, NULL, NULL, 5),
('Svenja, Harneit', 3, NULL, NULL, NULL, 6),
('Stefan, Heuermann', 3, NULL, NULL, NULL, 7),
('Stefanie, Humann', 3, NULL, NULL, NULL, 8),
('Dieter, Küpker', 3, NULL, NULL, NULL, 9),
('Andreas, Meyer', 3, NULL, NULL, NULL, 10),
('Alexander, Nielsen', 3, NULL, NULL, NULL, 11),
('Michael, Renken', 3, NULL, NULL, NULL, 12),
('Phillip, Schröder', 3, NULL, NULL, NULL, 13),
('Johanna, Skora', 3, NULL, NULL, NULL, 14),
('Michael, Skora', 3, NULL, NULL, NULL, 15),
('N.N., N.N', 3, NULL, NULL, NULL, 16),

-- Admin

('Heiko, Dähnenkamp', 2, NULL, NULL, NULL, 17);

Select * From struktur;