import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { stripesConnect } from '@folio/stripes/core';
import Course from '../components/Course';


// There are two basic approaches to fetching the cross-listed courses
// as well as the main course we're interested in. Either way, we need
// to find courses that share a courseListingId with the main course.
//
// 1. We can include here a second manifest entry that fetches the
// cross-listed courses using a `params` function to formulate a query
// based on the courseListingId of the main course. An example of this
// approach can be found in the `orderLines` entry of the Agreement
// manifest at https://github.com/folio-org/ui-agreements/blob/cafd42444bcb718ede5af8ca2e4332b52617b230/src/routes/AgreementViewRoute.js#L66-L82
//
// 2. We can fetch the cross-listed courses with a simpler manifest in
// a subcomponent. An example of this approach can be found in the
// handling of <JobLogContainer> in the Local KB Admin module at https://github.com/folio-org/ui-local-kb-admin/blob/abfecd4b10465b7d3acc4659f5487ba9deebfa1f/src/components/Logs/Logs.js#L29-L36
//
// In general, approach 2 is favoured only when lazy-loading
// potentially expensive data within a hidden accordion. Otherwise, we
// prefer approach 1 because it concentrates all data access in a
// single place.

class CourseRoute extends React.Component {
  static manifest = Object.freeze({
    course: {
      type: 'okapi',
      path: 'coursereserves/courses/:{id}',
    },
  });

  static propTypes = {
    match: PropTypes.shape({ // used implicitly by manifest.course.path
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    handlers: PropTypes.object,
    resources: PropTypes.shape({
      course: PropTypes.object,
    }).isRequired,
  };

  static defaultProps = {
    handlers: {},
  }

  urls = {
    edit: (() => `${this.props.location.pathname}/edit${this.props.location.search}`)
  }

  handleClose = () => {
    const { pathname, search } = this.props.location;
    this.props.history.push(`${pathname.replace(/(.*)\/.*/, '$1')}${search}`);
  }

  render() {
    const { handlers, resources } = this.props;
    return (
      <Course
        data={{
          course: {
            ...get(resources, 'course.records[0]', {}),
          },
        }}
        handlers={{
          ...handlers,
          onClose: this.handleClose,
          text: 'Some text'
        }}
        isLoading={get(resources, 'course.isPending', true)}
        urls={this.urls}
      />
    );
  }
}
export default stripesConnect(CourseRoute);
