import { IMAGES } from './data';

export interface PortfolioFact {
  label: string;
  value: string;
}

export interface PortfolioEntry {
  id: string;
  location: string;
  titleLines: [string, string];
  image: string;
  facts: PortfolioFact[];
}

export const PORTFOLIO: PortfolioEntry[] = [
  {
    id: 'quebec-forest',
    location: 'Quebec, Quebec',
    titleLines: ['3025–3039', 'Rue de la Forest'],
    image: IMAGES.heritage2,
    facts: [
      { label: 'Loan Type', value: 'Non-Revolving Demand Loan' },
      { label: 'Loan Amount', value: '$4,000,000.00 First Ranking Hypothecary Loan' },
      { label: 'Purpose', value: 'Acquisition' },
      { label: 'Borrower', value: '13467244 Canada Inc' },
      { label: 'Guarantor', value: 'Marc Lemieux' },
    ],
  },
  {
    id: 'winnipeg-mountain',
    location: 'Winnipeg, Manitoba',
    titleLines: ['1450', 'Mountain'],
    image: IMAGES.modern2,
    facts: [
      { label: 'Investment Type', value: 'LP Acquisition' },
      { label: 'Investment Amount', value: '$7,000,000.00' },
      { label: 'Purpose', value: 'Purchase' },
      { label: 'Buyer', value: 'LP to The Satisfaction Of The Lender' },
      { label: 'Guarantor', value: 'Henry Zavriyev' },
    ],
  },
  {
    id: 'edmonton-royal',
    location: 'Edmonton, AB · T5W 1H1',
    titleLines: ['Royal', 'Apartments'],
    image: IMAGES.heritage1,
    facts: [
      { label: 'Loan Type', value: 'Non-Revolving Demand Loan' },
      { label: 'Loan Amount', value: '$955,000.00 First Ranking Hypothecary Loan' },
      { label: 'Purpose', value: 'Purchase' },
      { label: 'Borrower', value: 'Zeus Properties LP' },
    ],
  },
];
