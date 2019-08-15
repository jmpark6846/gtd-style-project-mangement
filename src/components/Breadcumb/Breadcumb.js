import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Breadcumb({ projectId, projectName, listId, listHeading }) {
  return (
    <span>
      <Link to={`/projects`}>Projects</Link>
      {projectName && (
        <React.Fragment>
          <span>></span>
          <Link to={`/projects/${projectId}`}>{projectName}</Link>
        </React.Fragment>
      )}
      {projectName && listHeading && (
        <React.Fragment>
          <span>></span>
          <Link to={`/projects/${projectId}/lists/${listId}`}>{listHeading}</Link>
        </React.Fragment>
      )}
    </span>
  );
}

Breadcumb.propTypes = {};

export default Breadcumb;
