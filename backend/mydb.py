import mysql.connector

dataBase = mysql.connector.connect(
    host = 'localhost',
    user = 'root',
    passwd = 'Elina+35_elefanten!!tööö'
)

cursorObject = dataBase.cursor()

cursorObject.execute("CREATE DATABASE Hillmann_und_Geitz_DB")

print("All Done!")