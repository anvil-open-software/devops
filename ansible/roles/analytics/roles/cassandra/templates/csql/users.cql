-- need to do ansible vault with passwords similar in iqpoc
CREATE USER IF NOT EXISTS spark WITH PASSWORD '{{spark_user_password}}' SUPERUSER;