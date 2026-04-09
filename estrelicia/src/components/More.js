import React from "react";
import "./More.css";

const MoreCard = ({ title, shortText, fullText }) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; 
        };
    }, [open]);

    return (
    <>
        <div className="more-card">
            <h2>{title}</h2>

            <div className="card-content">
                <p>{shortText}</p>
            </div>

            <button onClick={() => setOpen(true)}>
                Ver mais
            </button>
        </div>

        {open && (
            <div className="modal" onClick={() => setOpen(false)}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    <h2>{title}</h2>

                    <div className="modal-content">
                        <ul className="modal-list">
                            {fullText.map((item, index) => (
                                <li key={index}>
                                    <i className={`fa-solid ${item.icon}`}></i>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={() => setOpen(false)}>
                        Ver menos
                    </button>
                </div>
            </div>
        )}
    </>
  );
};

const More = () => {


    return (
    <div className="more-container">
        <MoreCard
            title="A Casa"
            shortText="É a casa perfeita para relaxares e encontrares o sossego que precisas depois do stress do dia a dia."
            fullText={[{text:"Ferro de passar",icon:"fa-shirt"},{text:"TV",icon:"fa-tv"},{text:"Consola de videojogos",icon:"fa-gamepad"},{text:"Cinema",icon:"fa-film"},{text:"Ar condicionado central",icon:"fa-temperature-arrow-down"},
                {text:"Aquecimento central",icon:"fa-temperature-arrow-up"},{text:"Lareira interior",icon:"fa-fire-burner"},{text:"Extintor de incêndio",icon:"fa-fire-extinguisher"},{text:"Wi-Fi",icon:"fa-wifi"},{text:"Cozinha",icon:"fa-kitchen-set"},
                {text:"Frigorífico",icon:"fa-snowflake"},{text:"Micro-ondas",icon:"fa-water"},{text:"Tachos e panelas, óleo, sal e pimenta",icon:"fa-spoon"},{text:"Loiças e talheres",icon:"fa-utensils"},{text:"Mini frigorífico",icon:"fa-snowflake"},
                {text:"Congelador",icon:"fa-ice-cream"},{text:"Fogão",icon:"fa-fire-burner"},{text:"Chaleira elétrica",icon:"fa-mug-hot"},{text:"Máquina de café",icon:"fa-mug-hot"},{text:"Copos de vinho",icon:"fa-wine-glass"},{text:"Torradeira",icon:"fa-bread-slice"},
                {text:"Compactador de lixo",icon:"fa-trash"}
            ]}
        />

        <MoreCard
            title="Casa privada com 2 quartos"
            shortText="A suite está equipada com cama de casal, mesinhas de cabeceira, uma televisão e casa de banho privada. Incluímos toalhas, gel de banho e shampoo."
            fullText={[{text:"Água quente",icon:"fa-bath"},{text:"Gel de banho",icon:"fa-pump-soap"},{text:"Roupa de cama de algodão",icon:"fa-bed"},{text:"Cobertores e almofadas extra",icon:"fa-mattress-pillow"},{text:"Estores blackout",icon:"fa-rectangle-xmark"},
                {text:"Roupeiro embutido",icon:"fa-shirt"},{text:"TV",icon:"fa-tv"},{text:"Berço (disponível sob pedido)",icon:"fa-baby"},{text:"Cadeira de bebé independente",icon:"fa-baby-carriage"}
            ]}
        />

        <MoreCard
            title="Exterior da Strelícia House"
            shortText="Encante-se com um espaço acolhedor e funcional, especialmente porjetado para os hopsedes. O que nós prometemos é que no nosso espaço exterior vão encontrar locais de puro relaxamento com uma vista incrivel para as montanhas. "
            fullText={[{text:"Chuveiro exterior",icon:"fa-shower"},{text:"Parque infantil ao ar livre",icon:"fa-child"},{text:"Câmaras de segurança",icon:"fa-video"},{text:"Grelha de churrasco",icon:"fa-fire-burner"},{text:"Braseiro de jardim",icon:"fa-fire-flame-curved"},
                {text:"Zona de refeições ao ar livre",icon:"fa-umbrella-beach"},{text:"Estacionamento gratuito na rua",icon:"fa-car"},{text:"Piscina",icon:"fa-person-swimming"},{text:"Banheira hidromassagem (10:00: 00:00)",icon:"fa-temperature-arrow-up"},
                {text:"Ginásio partilhado",icon:"fa-dumbbell"},{text:"Piscina Aquecida (entre Abril/Outubro)",icon:"fa-water-ladder"}]}
        />
    </div>
  );
};

export default More;