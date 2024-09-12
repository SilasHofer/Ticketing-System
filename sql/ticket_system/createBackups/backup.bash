#!/usr/bin/env bash
DATABASE=${1:-ticket_system}

printf "Taking a backup of the database '%s'.\n" "$DATABASE"

mysqldump --routines --triggers --result-file=../backup.sql "$DATABASE"
ls -l ../backup.sql
