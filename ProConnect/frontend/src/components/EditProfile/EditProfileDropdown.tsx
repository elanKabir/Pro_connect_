import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import EditProfileForm from './EditProfileForm';
import EditProfileChangePasswordForm from './EditProfileChangePasswordForm';
import {Grid } from '@mui/material';
import EditProfileDelete from './EditProfileDelete';
import { EditSetters, EditValues, confirmationDialog, userDetails } from '../../apis/types';

type EditProfileProps = {
  EditValues : EditValues;
  EditSetters : EditSetters
  confirmationDialog : confirmationDialog
  userDetails :userDetails
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />))(({ theme }) =>
  ({
    border: `1px solid ${theme.palette.divider}`,'&:not(:last-child)': {
        borderBottom: 0,
    },
        '&:before': {
    },
    }));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
    ))(({ theme }) => 
    ({
        backgroundColor:
            theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
             marginLeft: theme.spacing(1),
        },
    }));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const EditProfileDropdown: React.FC<EditProfileProps> = ({
  EditValues,
  EditSetters,
  userDetails,
  confirmationDialog
}) => {
    const [expanded, setExpanded] = React.useState<string | false>('panel1');
    const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {setExpanded(newExpanded ? panel : false);};

  return (
    <Grid container xs = {12}>
        <Grid item xs = {12}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <Typography>Edit Profile Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <EditProfileForm  EditValues={EditValues} EditSetters={EditSetters}  userDetails = {userDetails}/>
            </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Typography>Change Password</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <EditProfileChangePasswordForm
                    EditValues = {EditValues}
                    EditSetters =  {EditSetters}
                />
            </AccordionDetails>
        </Accordion>

      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Delete Account</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <EditProfileDelete confirmationDialog={confirmationDialog} />
        </AccordionDetails>
      </Accordion>
      </Grid>
    </Grid>
  );
}
export default EditProfileDropdown