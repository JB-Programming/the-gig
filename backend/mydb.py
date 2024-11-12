import mysql.connector

dataBase = mysql.connector.connect(
    host = 'localhost',
    user = 'root',
    passwd = 'marschiboy4president'
)

cursorObject = dataBase.cursor()

cursorObject.execute("CREATE DATABASE Hillmann_und_Geitz_DB")

print("All Done!")