
import QuoteHeader from '../components/quote/QuoteHeader';
import QuoteForm from '../components/quote/QuoteForm';
import QuoteTable from '../components/quote/QuoteTable';
import QuoteTotal from '../components/quote/QuoteTotal';

export default function CotizacionNueva() {
    return (
        <div className="bg-sky-blue p-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <QuoteHeader />
                <QuoteForm />
                <QuoteTable />
                <QuoteTotal />
            </div>
        </div>
    );
}