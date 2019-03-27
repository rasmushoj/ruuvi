import mysql.connector as mariadb
from ruuvitag_sensor.ruuvitag import RuuviTag

# sensors = ['C2:CE:C6:B6:CF:6C','FB:D0:9F:EC:41:C7','C9:81:C7:79:A2:35']
sensors = ['FB:D0:9F:EC:41:C7','C9:81:C7:79:A2:35']

# Connect to sql
print(1)
db = mariadb.connect(host="127.0.0.1", user="writer", password="writer", database="observations")
print(2)
curs=db.cursor()
print(3)

for mac in sensors:
  print(4)
  sensor = RuuviTag(mac)
  print(5)
  state = sensor.update()
  print(6)
  state = sensor.state
  print(7)

  pres = state["pressure"]
  temp = state["temperature"]
  relhum = state["humidity"]
  sensorId = state["identifier"]

  # date DATE, time TIME, temperature NUMERIC, pressure NUMERIC, relativehumidity NUMERIC, identifier CHAR(1)
  # Write to database
  curs.execute ("""INSERT INTO observations
                   VALUES (CURRENT_DATE(), NOW(), {}, {}, {}, UNIX_TIMESTAMP(), '{}')""".format(temp, pres, relhum, sensorId))

db.commit()
db.close()

