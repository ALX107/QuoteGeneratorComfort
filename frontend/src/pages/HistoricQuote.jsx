import HistoricHeader from '../components/historic/HistoricHeader';
import HistoricTable from '../components/historic/HistoricTable';

export default function HistoricoCotizaciones() {
    return (
        <div className="bg-blue-dark p-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <HistoricHeader />
                <HistoricTable />
            </div>
        </div>
    );
}