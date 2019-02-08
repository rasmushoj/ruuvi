from ruuvitag_sensor.ruuvitag import RuuviTag

sensors = ['FB:D0:9F:EC:41:C7','C9:81:C7:79:A2:35']

for mac in sensors:
  sensor = RuuviTag(mac)

  # update state from the device
  state = sensor.update()
  print(state)
  # get latest state (does not get it from the device)
  state = sensor.state

  print(state["temperature"])
