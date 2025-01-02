-- Set existing rows to current timestamp
UPDATE connected_banks 
SET consent_given_at = NOW() 
WHERE consent_given_at IS NULL; 