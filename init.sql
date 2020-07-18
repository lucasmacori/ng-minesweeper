CREATE TABLE IF NOT EXISTS score (
	score_mode VARCHAR(10) NOT NULL,
	score_cols INT NOT NULL,
	score_rows INT NOT NULL,
	score_bombs INT NOT NULL,
	score_time INT NOT NULL,
	score_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS setting (
	name VARCHAR(50) NOT NULL PRIMARY KEY,
	value TEXT NOT NULL
)