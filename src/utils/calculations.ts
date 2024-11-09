export const calculateIRPS = (baseSalary: number): number => {
  // Tax brackets for Cape Verde IRPS
  const TAX_BRACKETS = [
    { min: 0, max: 36606, rate: 0, deduction: 0 },
    { min: 36607, max: 80000, rate: 0.14, deduction: 5125 },
    { min: 80001, max: 150000, rate: 0.21, deduction: 10725 },
    { min: 150001, max: Infinity, rate: 0.25, deduction: 16725 }
  ];

  const bracket = TAX_BRACKETS.find(b => baseSalary >= b.min && baseSalary <= b.max);
  if (!bracket) return 0;
  return Math.max(0, (baseSalary * bracket.rate) - bracket.deduction);
};

export const calculateSocialSecurity = (baseSalary: number, employmentType: string): number => {
  // Interns (Estagiários) pay 8%, others pay 8.5%
  const rate = employmentType === 'Estagiário(a)' ? 0.08 : 0.085;
  return baseSalary * rate;
};

export const calculateSalary = (employee: any, adjustments: any[] = []): any => {
  if (!employee) {
    return {
      baseSalary: 0,
      totalAllowances: 0,
      gross: 0,
      incomeTax: 0,
      socialSecurity: 0,
      net: 0,
      manualAdjustments: { bonuses: 0, deductions: 0 },
      totalDeductions: 0
    };
  }

  const { salary = 0, employmentType = '' } = employee;
  
  // Calculate total allowances
  const totalAllowances = (employee.foodAllowance || 0) +
    (employee.communicationAllowance || 0) +
    (employee.attendanceBonus || 0) +
    (employee.assiduityBonus || 0);

  // Calculate manual adjustments
  const activeAdjustments = adjustments?.filter(adj => !adj.processed) || [];
  const bonuses = activeAdjustments
    .filter(adj => adj.type === 'bonus')
    .reduce((sum, adj) => sum + adj.amount, 0);
  const deductions = activeAdjustments
    .filter(adj => adj.type === 'deduction')
    .reduce((sum, adj) => sum + adj.amount, 0);

  // Calculate gross salary (base + allowances + bonuses)
  const grossSalary = salary + totalAllowances + bonuses;

  // Calculate deductions
  const incomeTax = calculateIRPS(salary); // IRPS only on base salary
  const socialSecurity = calculateSocialSecurity(salary, employmentType); // INPS only on base salary
  const totalDeductions = incomeTax + socialSecurity + deductions;

  // Calculate net salary
  const netSalary = grossSalary - totalDeductions;

  return {
    baseSalary: salary,
    totalAllowances,
    gross: grossSalary,
    incomeTax,
    socialSecurity,
    net: netSalary,
    manualAdjustments: {
      bonuses,
      deductions
    },
    totalDeductions
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-CV', {
    style: 'currency',
    currency: 'CVE',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumberInWords = (amount: number): string => {
  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const scales = ['', 'mil', 'milhão', 'bilhão'];

  if (amount === 0) return 'zero';

  const formatGroup = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' e ' + units[n % 10] : '');
    return units[Math.floor(n / 100)] + ' cento' + (n % 100 !== 0 ? ' e ' + formatGroup(n % 100) : '');
  };

  let words = '';
  let scaleIndex = 0;

  while (amount > 0) {
    const group = amount % 1000;
    if (group !== 0) {
      const groupWords = formatGroup(group);
      words = groupWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] + ' ' : '') + words;
    }
    amount = Math.floor(amount / 1000);
    scaleIndex++;
  }

  return words.trim() + ' escudos';
};