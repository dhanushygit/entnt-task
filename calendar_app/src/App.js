
import React, { useState, useEffect } from 'react';
import './App.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const App = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedCompanyLogs, setSelectedCompanyLogs] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    location: '',
    linkedin_profile: '',
    emails: '',
    phone_numbers: '',
    comments: '',
    communication_periodicity: 14,
  });
  const [newLog, setNewLog] = useState({
    companyId: '',
    communication_type: '',
    date: '',
    notes: '',
  });

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const handleAddCompany = () => {
    if (!newCompany.name) return alert('Company name is required!');
    const companyId = companies.length + 1;
    const updatedCompanies = [...companies, { id: companyId, ...newCompany }];
    setCompanies(updatedCompanies);
    setNewCompany({
      name: '',
      location: '',
      linkedin_profile: '',
      emails: '',
      phone_numbers: '',
      comments: '',
      communication_periodicity: 14,
    });
  };

  const handleAddLog = () => {
    if (!newLog.companyId || !newLog.communication_type || !newLog.date) {
      return alert('Please fill all required fields!');
    }
    const updatedCompanies = companies.map((company) => {
      if (company.id === parseInt(newLog.companyId)) {
        const updatedLogs = [...(company.logs || []), newLog];
        return { ...company, logs: updatedLogs };
      }
      return company;
    });
    setCompanies(updatedCompanies);
    setNewLog({
      companyId: '',
      communication_type: '',
      date: '',
      notes: '',
    });
  };

  const handleDeleteCompany = (companyId) => {
    const updatedCompanies = companies.filter((company) => company.id !== companyId);
    setCompanies(updatedCompanies);
    if (selectedCompanyId === companyId) {
      setSelectedCompanyId(null);
      setSelectedCompanyLogs([]);
    }
  };

  const handleSelectCompany = (companyId) => {
    setSelectedCompanyId(companyId);
    const selectedCompany = companies.find((company) => company.id === companyId);
    setSelectedCompanyLogs(selectedCompany?.logs || []);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getTrafficLightColor = (logDate) => {
    const logDateObj = new Date(logDate);
    const today = new Date();
    const differenceInDays = Math.floor((today - logDateObj) / (1000 * 60 * 60 * 24));

    if (differenceInDays <= 1) {
      return 'red';
    } else if (differenceInDays > 1 && differenceInDays <= 7) {
      return 'yellow';
    } else {
      return 'green';
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header>
        <h1> ENTNT Communication Tracker</h1>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
      </header>

      <div className="main-content">
        <div className="left-panel">
          <h2>Companies</h2>
          <ul className="company-list">
            {companies.map((company) => (
              <li
                key={company.id}
                className={`company-item ${company.id === selectedCompanyId ? 'active' : ''}`}
                onClick={() => handleSelectCompany(company.id)}
              >
                <span>{company.name} - {company.location}</span>
                <div className="company-actions">
                  {company.linkedin_profile && (
                    <a href={company.linkedin_profile} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faLinkedin} className="icon linkedin-icon" />
                    </a>
                  )}
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCompany(company.id);
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <h3>Add Company</h3>
          <input
            type="text"
            placeholder="Name"
            value={newCompany.name}
            onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={newCompany.location}
            onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
          />
          <input
            type="url"
            placeholder="LinkedIn Profile"
            value={newCompany.linkedin_profile}
            onChange={(e) =>
              setNewCompany({ ...newCompany, linkedin_profile: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Emails (comma-separated)"
            value={newCompany.emails}
            onChange={(e) => setNewCompany({ ...newCompany, emails: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Numbers (comma-separated)"
            value={newCompany.phone_numbers}
            onChange={(e) => setNewCompany({ ...newCompany, phone_numbers: e.target.value })}
          />
          <textarea
            placeholder="Comments"
            value={newCompany.comments}
            onChange={(e) => setNewCompany({ ...newCompany, comments: e.target.value })}
          />
          <button onClick={handleAddCompany}>Add Company</button>
        </div>

        <div className="right-panel">
          <h2>Communication Logs</h2>
          {selectedCompanyLogs.length > 0 ? (
            <ul>
              {selectedCompanyLogs.map((log, index) => (
                <li
                  key={index}
                  className={`log-item ${getTrafficLightColor(log.date)}`}
                >
                  <strong>
                    {log.communication_type} - {log.date} ({companies.find((c) => c.id === parseInt(log.companyId))?.name})
                  </strong>
                  <p>{log.notes}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No active logs for this company.</p>
          )}

          <h3>Add Communication Log</h3>
          <select
            value={newLog.companyId}
            onChange={(e) => setNewLog({ ...newLog, companyId: e.target.value })}
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <select
            value={newLog.communication_type}
            onChange={(e) => setNewLog({ ...newLog, communication_type: e.target.value })}
          >
            <option value="">Select Communication Type</option>
            <option value="LinkedIn Post">LinkedIn Post</option>
            <option value="Email">Email</option>
            <option value="Phone Call">Phone Call</option>
          </select>
          <input
            type="date"
            value={newLog.date}
            onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
          />
          <textarea
            placeholder="Notes"
            value={newLog.notes}
            onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
          />
          <button onClick={handleAddLog}>Add Log</button>
        </div>
      </div>
    </div>
  );
};

export default App;
