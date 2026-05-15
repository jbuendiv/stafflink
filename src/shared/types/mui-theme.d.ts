import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    navLink: React.CSSProperties;
    tableHeader: React.CSSProperties;
    tableCell: React.CSSProperties;
    detailLabel: React.CSSProperties;
    detailValue: React.CSSProperties;
    formLabel: React.CSSProperties;
    formValue: React.CSSProperties;
    cardTitle: React.CSSProperties;
    cardSubtitle: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    navLink?: React.CSSProperties;
    tableHeader?: React.CSSProperties;
    tableCell?: React.CSSProperties;
    detailLabel?: React.CSSProperties;
    detailValue?: React.CSSProperties;
    formLabel?: React.CSSProperties;
    formValue?: React.CSSProperties;
    cardTitle?: React.CSSProperties;
    cardSubtitle?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    navLink: true;
    tableHeader: true;
    tableCell: true;
    detailLabel: true;
    detailValue: true;
    formLabel: true;
    formValue: true;
    cardTitle: true;
    cardSubtitle: true;
  }
}
