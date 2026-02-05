-- Seed data for draft_positions table
-- Generated from OBL Draft Position History.csv
-- Missing years: 2006, 2008, 2019, 2020, 2023

-- Insert draft positions using team name and season year lookups
-- Each INSERT finds the team_id and season_id dynamically

-- Jamaica's Finest
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Jamaica''s Finest' AND s.year = 2025;

-- Junkyard Dawgs
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Junkyard Dawgs' AND s.year = 2025;

-- Outta Control
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Outta Control' AND s.year = 2025;

-- Menace
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Menace' AND s.year = 2025;

-- Showtime
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Showtime' AND s.year = 2025;

-- Hampton Ballers
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Hampton Ballers' AND s.year = 2025;

-- Skindeep Ballaz
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Skindeep Ballaz' AND s.year = 2025;

-- Blank
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Blank' AND s.year = 2025;

-- Gunslingers
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Gunslingers' AND s.year = 2025;

-- Makaveli
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Makaveli' AND s.year = 2025;

-- Burghman
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Burghman' AND s.year = 2025;

-- AMW
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'AMW' AND s.year = 2025;

-- Birrrdy
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 12 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 9 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 8 FROM teams t, seasons s WHERE t.name = 'Birrrdy' AND s.year = 2025;

-- Stout
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 7 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2003;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2004;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2005;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2007;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 11 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2009;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2010;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2011;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 3 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2012;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 5 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2013;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2014;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 10 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2015;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 4 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2016;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2017;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 6 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2018;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 2 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2021;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 14 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2022;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 1 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2024;
INSERT INTO draft_positions (team_id, season_id, draft_position)
SELECT t.id, s.id, 13 FROM teams t, seasons s WHERE t.name = 'Stout' AND s.year = 2025;
