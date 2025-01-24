export const environment = {
  pricingPlanOptionsArray: [
    {
      description: 'Unica consulta',
      price: 20000,
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
