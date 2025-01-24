export const environment = {
  pricingPlanOptionsArray: [
    {
      description: 'Minimo',
      price: 20000,
      months: 1,
      benefits: [
        { name: 'Seguimiento', include: false },
        { name: 'Diagnostico', include: true },
        { name: 'Antropometria', include: true },
        { name: 'Personalizacion', include: false },
        { name: 'Plan Nutricional', include: true },
      ],
    },
    {
      description: '3 meses',
      price: 30000,
      months: 3,
      benefits: [
        { name: 'Seguimiento', include: false },
        { name: 'Diagnostico', include: true },
        { name: 'Antropometria', include: true },
        { name: 'Personalizacion', include: false },
        { name: 'Plan Nutricional', include: true },
      ],
    },
    {
      description: '6 meses',
      price: 25000,
      months: 6,
      benefits: [
        { name: 'Seguimiento', include: false },
        { name: 'Diagnostico', include: true },
        { name: 'Antropometria', include: true },
        { name: 'Personalizacion', include: false },
        { name: 'Plan Nutricional', include: true },
      ],
    },
  ],
};
