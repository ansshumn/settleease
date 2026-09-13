export interface EmergencyContact {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'pharmacy' | 'fire' | 'ambulance';
  address: string;
  phone: string;
  is24x7: boolean;
  distance: string;
}

export interface PincodeData {
  [pincode: string]: EmergencyContact[];
}

export const emergencyData: PincodeData = {
  '560078': [
    {
      id: 'e1',
      name: 'Apollo Hospital',
      type: 'hospital',
      address: '14th Main Road, JP Nagar 5th Phase',
      phone: '080-26782323',
      is24x7: true,
      distance: '1.2 km'
    },
    {
      id: 'e2',
      name: 'Manipal Hospital',
      type: 'hospital',
      address: '98, HAL Old Airport Road',
      phone: '080-25024444',
      is24x7: true,
      distance: '3.5 km'
    },
    {
      id: 'e3',
      name: 'JP Nagar Police Station',
      type: 'police',
      address: '15th Cross, JP Nagar 5th Phase',
      phone: '080-26494949',
      is24x7: true,
      distance: '0.8 km'
    },
    {
      id: 'e4',
      name: 'MedPlus Pharmacy',
      type: 'pharmacy',
      address: '24/7 Store, 6th Phase Main Road',
      phone: '080-26784545',
      is24x7: true,
      distance: '0.5 km'
    },
    {
      id: 'e5',
      name: 'Apollo Pharmacy',
      type: 'pharmacy',
      address: '3rd Main, JP Nagar 4th Phase',
      phone: '080-26783333',
      is24x7: true,
      distance: '1.0 km'
    }
  ],
  '560034': [
    {
      id: 'e6',
      name: 'St. Johns Hospital',
      type: 'hospital',
      address: 'Sarjapur Road, Koramangala',
      phone: '080-22065000',
      is24x7: true,
      distance: '1.5 km'
    },
    {
      id: 'e7',
      name: 'Fortis Hospital',
      type: 'hospital',
      address: '154/9, Bannerghatta Road',
      phone: '080-66214444',
      is24x7: true,
      distance: '2.8 km'
    },
    {
      id: 'e8',
      name: 'Koramangala Police Station',
      type: 'police',
      address: '80 Feet Road, Koramangala 4th Block',
      phone: '080-25520242',
      is24x7: true,
      distance: '0.6 km'
    },
    {
      id: 'e9',
      name: 'Wellness Forever Pharmacy',
      type: 'pharmacy',
      address: 'Sony World Signal, Koramangala',
      phone: '080-25524545',
      is24x7: true,
      distance: '0.4 km'
    },
    {
      id: 'e10',
      name: 'Netmeds Pharmacy',
      type: 'pharmacy',
      address: '5th Block, Koramangala',
      phone: '080-25521212',
      is24x7: false,
      distance: '0.7 km'
    }
  ],
  '560066': [
    {
      id: 'e11',
      name: 'Columbia Asia Hospital',
      type: 'hospital',
      address: 'Kirloskar Business Park, Whitefield',
      phone: '080-67127127',
      is24x7: true,
      distance: '1.8 km'
    },
    {
      id: 'e12',
      name: 'Narayana Health',
      type: 'hospital',
      address: 'ITPL Main Road, Whitefield',
      phone: '080-71222222',
      is24x7: true,
      distance: '2.2 km'
    },
    {
      id: 'e13',
      name: 'Whitefield Police Station',
      type: 'police',
      address: 'Whitefield Main Road',
      phone: '080-28452100',
      is24x7: true,
      distance: '1.0 km'
    },
    {
      id: 'e14',
      name: 'Pharma Care 24x7',
      type: 'pharmacy',
      address: 'ITPL Main Road, Whitefield',
      phone: '080-28453636',
      is24x7: true,
      distance: '0.9 km'
    }
  ],
  '560102': [
    {
      id: 'e15',
      name: 'Sakra World Hospital',
      type: 'hospital',
      address: 'SY NO. 52/2 & 52/3, Devarabeesanahalli',
      phone: '080-49694969',
      is24x7: true,
      distance: '2.0 km'
    },
    {
      id: 'e16',
      name: 'Marathahalli Police Station',
      type: 'police',
      address: 'Marathahalli Bridge',
      phone: '080-25230500',
      is24x7: true,
      distance: '1.2 km'
    },
    {
      id: 'e17',
      name: 'HealthPlus Pharmacy',
      type: 'pharmacy',
      address: 'Marathahalli Main Road',
      phone: '080-25237878',
      is24x7: true,
      distance: '0.6 km'
    }
  ],
  '560068': [
    {
      id: 'e18',
      name: 'Jayadeva Hospital',
      type: 'hospital',
      address: '9th Block, Jayanagar',
      phone: '080-22977000',
      is24x7: true,
      distance: '1.4 km'
    },
    {
      id: 'e19',
      name: 'BTM Layout Police Station',
      type: 'police',
      address: '2nd Stage, BTM Layout',
      phone: '080-26680880',
      is24x7: true,
      distance: '0.9 km'
    },
    {
      id: 'e20',
      name: 'Trust Pharmacy',
      type: 'pharmacy',
      address: 'Silk Board, BTM Layout',
      phone: '080-26681234',
      is24x7: true,
      distance: '0.5 km'
    }
  ]
};

export const nationalEmergency = [
  { name: 'Police', number: '100' },
  { name: 'Ambulance', number: '108' },
  { name: 'Fire', number: '101' },
  { name: 'Women Helpline', number: '181' },
  { name: 'Emergency (All)', number: '112' }
];
