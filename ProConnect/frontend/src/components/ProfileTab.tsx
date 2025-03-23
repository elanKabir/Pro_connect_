import React, { useEffect, useState } from 'react';
import {Grid } from '@mui/material';
import ScrollableTabsButtonPrevent from './Tab';
import ProfileBio from './ProfileBio'
import ProfileRecentProject from './ProfileRecentProject';

interface BasicTabsProps {
    tabLabels?: string[];
  }

const ProfileTab: React.FC<BasicTabsProps> = ({}) => {
    const tabsData = [
        { label: "Recent Projects", content: <ProfileRecentProject/> },
        { label: "Reviews", content: "This is content for Tab 2" },
        { label: "Bio", content: <ProfileBio/> }
      ];

    return (
        	<Grid container spacing={1} style={{
            	gridTemplateColumns: 'auto',
            	backgroundColor:'turquoise'
            	}}>
            	<Grid item xs={3} style={{ backgroundColor:'green' }}>
            	</Grid>
            	<Grid item xs={9} style={{ backgroundColor:'orange' }}>
              		<Grid container spacing={1} style={{
             			backgroundColor:'turquoise',
             			}} direction={'column'}>
						<Grid item xs={4} style={{ backgroundColor:'purple' }}>
						</Grid>
						<Grid item xs={8} style={{ backgroundColor:'turquoise' }}>
							<ScrollableTabsButtonPrevent tabs={tabsData}/>
						</Grid>
            		</Grid>
				</Grid>
          	</Grid>

    );
}
export default ProfileTab;


