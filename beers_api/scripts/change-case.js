let changeCase = require('change-case')
let _ = require('underscore')
let items = [
  'MMCode',
  'VehicleType',
  'Make',
  'Model',
  'Variant',
  'RegYear',
  'PublicationSection',
  'Master_Model',
  'Make_Code',
  'Model_Code',
  'VariantCode',
  'AxleConfiguration',
  'BodyType',
  'NoOfDoors',
  'Drive',
  'Seats',
  'Use',
  'Wheelbase',
  'ManualAuto',
  'NoGears',
  'Cooling',
  'CubicCapacity',
  'CylConfiguration',
  'EngineCycle',
  'FuelTankSize',
  'FuelType',
  'Kilowatts',
  'NoCylinders',
  'TurboOrSuperCharged',
  'GCM',
  'GVM',
  'Tare',
  'Origin',
  'FrontNoTyres',
  'FrontTyreSize',
  'RearNoTyres',
  'RearTyreSize',
  'IntroDate',
  'DiscDate',
  'CO2',
  'Length',
  'Height',
  'Width',
  'NewListPrice',
];

_.each(items, (item) => {
  let stringItem = 
`$table->string('${changeCase.snakeCase(item)}');`
  console.log(stringItem)
})