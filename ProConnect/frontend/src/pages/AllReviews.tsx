import React from 'react';
import MakePage from '../components/MakePage';
import ReviewPagination from '../components/Reviews/ReviewPagination';

const AllReviews: React.FC = () => {
    return (
      <>
        <MakePage
          pageTitle={'All Reviews'}
          pageElement={
            <>
              <h1 style={{ textAlign: 'center' }}>All Reviews</h1>
              <ReviewPagination />
            </>
          }
          setTokenHandler={function (token: string | null): void {
            throw new Error('Function not implemented.');
          }}
          token={null}
        />
      </>
    );
  };
  export default AllReviews;
