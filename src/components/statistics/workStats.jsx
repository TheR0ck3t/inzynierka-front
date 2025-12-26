import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import { io } from 'socket.io-client';
import logger from '../../utils/logger';
import '../../assets/styles/WorkStats.css';

const componentLogger = logger.createChildLogger('WorkStats');

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function WorkStats() {
    const [dailyStats, setDailyStats] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('daily');

    const fetchStats = async () => {
    try {
        setLoading(true);
        setError(null);
        
        const [dailyRes, weeklyRes, monthlyRes, employeesRes] = await Promise.all([
            axios.get('/api/work-stats/daily'),
            axios.get('/api/work-stats/weekly'), 
            axios.get('/api/work-stats/monthly'),
            axios.get('/api/work-stats/all-employees-status') // Zmienione na endpoint zwracający wszystkich
        ]);
        
        setDailyStats(Array.isArray(dailyRes.data?.data) ? dailyRes.data.data : []);
        setWeeklyStats(Array.isArray(weeklyRes.data?.data) ? weeklyRes.data.data : []);
        setMonthlyStats(Array.isArray(monthlyRes.data?.data) ? monthlyRes.data.data : []);
        setEmployeeList(Array.isArray(employeesRes.data?.data) ? employeesRes.data.data : []);

        componentLogger.info('Statystyki załadowane pomyślnie');
    
    } catch (error) {
        setError('Wystąpił błąd podczas ładowania statystyk.');
        componentLogger.error('Błąd podczas ładowania statystyk:', error);
    } finally {
        setLoading(false);
    }
};

    const fetchEmployeesOnly = async () => {
        try {
            const employeesRes = await axios.get('/api/work-stats/all-employees-status');
            setEmployeeList(Array.isArray(employeesRes.data?.data) ? employeesRes.data.data : []);
            componentLogger.debug('Lista pracowników zaktualizowana');
        } catch (error) {
            componentLogger.error('Błąd podczas aktualizacji listy pracowników:', error);
        }
    };

    useEffect(() => {
        fetchStats();
        
        // WebSocket dla real-time updates - relatywnie przez Vite proxy
        const socket = io('/employees-status', {
            withCredentials: true
        });
        
        socket.on('connect', () => {
            componentLogger.info('Connected to employees-status WebSocket');
        });
        
        socket.on('status-update', (data) => {
            componentLogger.info('Received status update:', data);
            // Odśwież TYLKO listę pracowników (nie całe statystyki)
            fetchEmployeesOnly();
        });
        
        socket.on('disconnect', () => {
            componentLogger.info('Disconnected from employees-status WebSocket');
        });
        
        // Opcjonalnie: fallback polling co 30 sekund (gdyby WebSocket nie działał)
        const interval = setInterval(() => {
            fetchEmployeesOnly();
        }, 30000);
        
        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, []);

    if (loading) {
        return <div className="loading">Ładowanie statystyk...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="work-stats">
            <h2>Statystyki Pracy</h2>
        {/* Tabs for Daily, Weekly, Monthly */}
        <div className="stats-tab">
            <button
            className={activeTab === 'daily' ? 'active' : ''}
            onClick={() => setActiveTab('daily')}
        >
            Dziennie
        </button>
        <button
            className={activeTab === 'weekly' ? 'active' : ''}
            onClick={() => setActiveTab('weekly')}
        >
            Tygodniowo
        </button>
        <button
            className={activeTab === 'monthly' ? 'active' : ''}
            onClick={() => setActiveTab('monthly')}
        >
            Miesięcznie
        </button>
        <button
            className={activeTab === 'current' ? 'active' : ''}
            onClick={() => setActiveTab('current')}
        >
            Obecni Pracownicy
        </button>
        </div>
        {/* Charts Section */}
        <div className="charts-grid">
            {/* Daily Stats Chart */}
            {activeTab === 'daily' && (
                <div className="chart-container">
                    <h3>Godziny pracy w ostatnich 7 dniach</h3>
                    <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${parseFloat(value).toFixed(1)}h`, 'Godziny pracy']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total_hours" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Łączne godziny"
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_hours" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Średnie godziny"
                />
              </LineChart>
            </ResponsiveContainer>
                </div>
            )}
            {/* Weekly Stats Chart */}
            {activeTab === 'weekly' && (
                <div className="chart-container">
                    <h3>Godziny pracy w tym tygodniu</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day_name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${parseFloat(value).toFixed(1)}h`, 'Godziny pracy']} />
                            <Legend />
                            <Bar 
                                dataKey="total_hours" 
                                fill="#8884d8" 
                                name="Łączne godziny"
                            />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            {/* Monthly Stats Chart */}
            {activeTab === 'monthly' && (
                <div className="chart-container">
                    <h3>Godziny pracy w miesiącu</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${parseFloat(value).toFixed(1)}h`, 'Godziny pracy']} />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="total_hours" 
                                stroke="#8884d8" 
                                strokeWidth={2}
                                name="Łączne godziny"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="avg_hours" 
                                stroke="#82ca9d" 
                                strokeWidth={2}
                                name="Średnie godziny"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
            {/* Current Employees Chart */}
            {activeTab === 'current' && (
    <div className="chart-container">
        <div className="current-employees-header">
            <h3>Obecni Pracownicy</h3>
            <div className="employee-summary">
                <span className="working-count">
                    🟢 Obecni: {employeeList.filter(emp => emp.is_working).length}
                </span>
                <span className="away-count">
                    🔴 Nieobecni: {employeeList.filter(emp => !emp.is_working).length}
                </span>
                <span className="total-count">
                    👥 Razem: {employeeList.length}
                </span>
            </div>
        </div>
        
        <div className="employees-grid">
            {employeeList.map((employee, index) => (
                <div key={`employee-${employee.employee_id}-${index}`} className={`employee-card ${employee.is_working ? 'working' : 'away'}`}>
                    <div className="employee-status">
                        <span className={`status-dot ${employee.is_working ? 'green' : 'red'}`}></span>
                        <div className="employee-info">
                            <span className="employee-name">{employee.employee_name}</span>
                            <span className="employee-department">{employee.department_name || 'Brak działu'}</span>
                            {employee.job_title && (
                                <span className="employee-title">{employee.job_title}</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="employee-details">
                        <div className="work-time">
                            <span className="hours">
                                {employee.is_working ? 
                                    `${parseFloat(employee.hours_today || 0).toFixed(1)}h` : 
                                    'Nieobecny'
                                }
                            </span>
                        </div>
                        
                        {employee.is_working && employee.shift_start && (
                            <div className="start-time">
                                Rozpoczął: {new Date(employee.shift_start).toLocaleTimeString('pl-PL', {
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                })}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
        
        {employeeList.length === 0 && (
            <div className="no-employees">
                Brak danych o pracownikach
            </div>
        )}
    </div>
)}
        </div>
        </div>
    );
}
