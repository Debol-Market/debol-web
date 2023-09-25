import DeleteModal from "@/components/admin/BasketModal/DeleteModal";
import { deleteProduct, getProduct, updateProduct } from "@/services/database";
import { Product } from "@/utils/types";
import useAdmin from "@/utils/useAdmin";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { MdOutlineArrowBack } from "react-icons/md";

const Page = () => {
  useAdmin();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>();
  const [modalOpen, setModalOpen] = useState(false);
  const { productId } = router.query;
  const [deleteProductModal, setdeleteProductModal] = useState(false);
  const [image, setimage] = useState("");

  useEffect(() => {
    if (!productId) return;
    getProduct(productId as string).then((val) => {
      setProduct(val);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!product || !productId || loading) return;
    if (product == undefined) {
      delProduct();
    } else updateProduct(product, productId as string);
  }, [product, productId]);

  // useEffect(() => {
  //   if (product) getUrl(product.image).then(setimage);
  // }, [product?.image]);

  const delProduct = () => {
    if (!productId) return;
    deleteProduct(productId as string).then(() => router.push("/"));
  };

  if (!product) return <></>;

  return (
    <div className="min-h-screen bg-slate-200 p-10 ">
      <Link href="/admin/products">
        <div className="flex justify-start my-2">
          <MdOutlineArrowBack size={30} />
        </div>
      </Link>
      <div className="p-10 shadow-lg rounded-xl bg-white flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-10">
            <div className="border shadow-xl overflow-hidden  aspect-square max-h-[240px] rounded-2xl">
              {/* TODO: find a way to display images */}
              {/* <img src={image} alt="" className="object-cover h-full w-full" /> */}
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-slate-600">
                Description {product.description}
              </p>
              <p className="text-slate-600">Vendor: {product.vendor}</p>
              {/* <p className="text-slate-600">Catagory: {product.catagory}</p>
              <p className="text-slate-600">Unit: {product.catagory}</p> */}
            </div>
          </div>
        </div>
        <div className="">
          <button
            className="flex place-content-end justify-items-start p-2 mb-8"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <BiSolidPencil size={24} />
          </button>
          <button
            className="flex place-content-end justify-items-end p-2 mt-8"
            onClick={() => {
              setdeleteProductModal(true);
            }}
          >
            <AiOutlineDelete size={24} />
          </button>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-[50px] p-10 justify-start mt-5 rounded-xl"></div>
      </div>

      {deleteProductModal && (
        <DeleteModal
          onDelete={delProduct}
          onCancel={() => setdeleteProductModal(false)}
          delName={product.name}
        />
      )}
      {/* {modalOpen && (
        <EditProductModal
          product={product}
          onEdit={(prod: Product) => {
            setModalOpen(false);
            setProduct(prod);
          }}
          onCancel={() => setModalOpen(false)}
        />
      )} */}

      {/* /> */}
      {/* )} */}
    </div>
  );
};

export default Page;
