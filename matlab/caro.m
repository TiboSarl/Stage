close all;
clear;

nom = "freeTexture11";

I = imread('./../graphics/masque_' + nom + '.png');
Itex = imread('./../graphics/' + nom' + ".png");

[nblignes,nbcols,nbcan] = size(Itex);
Itexaug = zeros(2*nblignes,2*nbcols,nbcan);

%gauche haut
Itexaug(1:nblignes,1:nbcols,:) = Itex(:,:,:);
Iaug(1:nblignes,1:nbcols,:) = I(:,:,:);

%gauche bas
Itexaug(nblignes+1:2*nblignes,1:nbcols,:) = Itex(:,:,:);
Iaug(nblignes+1:2*nblignes,1:nbcols,:) = I(:,:,:);

%droite haut
Itexaug(1:nblignes,nbcols+1:2*nbcols,:) = Itex(:,:,:);
Iaug(1:nblignes,nbcols+1:2*nbcols,:) = I(:,:,:);

%droite bas
Itexaug(nblignes+1:2*nblignes,nbcols+1:2*nbcols,:) = Itex(:,:,:);
Iaug(nblignes+1:2*nblignes,nbcols+1:2*nbcols,:) = I(:,:,:);

figure;
imshow(Itexaug);

figure;
imshow(Iaug);

Itexaug = double(Itexaug);
Iaug = double(Iaug);

[nblignesaug, nbcolsaug,nbcan] = size(Itexaug);
CC = bwconncomp(Iaug);
list = CC.PixelIdxList;
centres = [];
fid = fopen(nom +"/centrebis"+ nom +".json",'w');
fprintf(fid,'[');
premier = true;
compteur=1;
for k = 1:length(list)

Pierre1 = list{k};
Pierre = zeros(nblignesaug,nbcolsaug,nbcan);
PierreTex = zeros(nblignesaug,nbcolsaug,nbcan);
for i = 1:length(Pierre1)
    [row,col,can] = ind2sub([nblignesaug nbcolsaug nbcan],Pierre1(i));
    Pierre(row,col,can) = 255;
    PierreTex(row,col,can) = Itexaug(row,col,can);
    
end

PierreTex = uint8(PierreTex);
A =  double(Pierre(:,:,1) ==255);

[Irec,Arec,coinhautgauche] = recadrage(PierreTex,A);

x = coinhautgauche(1);
y = coinhautgauche(2);

if ((x > (nblignes/2) && x <= (3/2 * nblignes) && y>(nbcols/2) && y<= (3/2*nbcols)))
    if(~premier)
        fprintf(fid, ',');
    end
    [lignesPierre,colonnesPierre, canauxPierre] = size(Irec);
    xPierre = mod(mod(x,512) + lignesPierre/2, 512);
    yPierre = mod(mod(y, 512) + colonnesPierre/2, 512);
    fprintf(fid,'[%f', xPierre);
    fprintf(fid,',');
    fprintf(fid,'%f]', yPierre);
    premier = false;
    imwrite(Irec, nom  + '/Pierre'+ compteur +'.png','Alpha',Arec);
    compteur = compteur +1;
    
    yPierre = round(yPierre);
    xPierre = round(xPierre);
    if yPierre == 0
        yPierre = 1;
    end
    if xPierre == 0
        xPierre = 1;
    end
    I(xPierre:xPierre+2,yPierre:yPierre+2,1) = 255;
    I(xPierre:xPierre+2,yPierre:yPierre+2,2) = 0;
    I(xPierre:xPierre+2,yPierre:yPierre+2,3) = 0;
end




end

figure;
imshow(I);

fprintf(fid,']');
fclose(fid);

